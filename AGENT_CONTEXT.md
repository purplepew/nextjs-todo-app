# Agent Context — Next.js Todo App

> This file is intended for AI agents working on this repository.
> It summarises the architecture, data flow, key decisions, and current state of the codebase.

---

## Overview

A full-stack todo application built with **Next.js 15 (App Router)**, **React 19**, **Redux Toolkit (RTK Query)**, **MUI v7**, and **MongoDB** (via Mongoose). Authentication is handled through **Google OAuth 2.0** with custom **JWT** access/refresh token management.

There are two operating modes:

| Mode | Trigger | Storage |
|------|---------|---------|
| **Online** | User is authenticated (has a valid JWT) | MongoDB via REST API |
| **Offline** | User is not authenticated | `localStorage` (todos + order) |

---

## Directory Structure

```
src/
├── middleware.ts                    # JWT auth guard for /api/todos/* and /api/users/*
└── app/
    ├── page.tsx                     # Root page — renders online or offline view
    ├── layout.tsx
    ├── Providers.tsx                # Wraps app in Redux StoreProvider + MUI ThemeProvider
    ├── StoreProvider.tsx
    ├── ThemeProviderWrapper.tsx
    ├── Loading.tsx
    ├── globals.css
    ├── hooks/
    │   └── useAuth.tsx              # Reads auth state from Redux (id, token, isLoading)
    ├── components/
    │   ├── TodoCard.tsx             # Individual todo item (shared by both modes)
    │   ├── Header.tsx
    │   ├── SignInButton.tsx
    │   ├── ProfileAvatar.tsx
    │   ├── online/
    │   │   ├── TodoList.tsx         # Online drag-and-drop list; persists order to server
    │   │   └── NewTodoForm.tsx
    │   └── offline/
    │       ├── TodoList.tsx         # Offline drag-and-drop list; persists order to localStorage
    │       ├── OfflinePage.tsx
    │       └── NewTodoForm.tsx
    ├── lib/
    │   ├── store.ts                 # Redux store (apiSlice, auth, error, todo reducers)
    │   ├── db.ts                    # MongoDB connection helper (connectToMongoDB)
    │   ├── hooks.ts                 # Typed useAppDispatch / useAppSelector
    │   ├── types.ts                 # Shared TypeScript types (ApiResponse)
    │   ├── OAuthClient.ts
    │   ├── utils/wait.ts
    │   ├── models/
    │   │   ├── models.ts            # Re-exports User and Todo models
    │   │   ├── todoModel.ts         # Mongoose Todo schema (title, completed, userId, timestamps)
    │   │   └── userModel.ts         # Mongoose User schema (email, picture, name, todos[])
    │   └── features/
    │       ├── apiSlice.ts          # RTK Query base with JWT bearer + auto token refresh
    │       ├── error/errorSlice.ts
    │       ├── auth/
    │       │   ├── authSlice.ts     # { token, isLoading } in Redux
    │       │   ├── authApiSlice.ts
    │       │   ├── Prefetch.tsx
    │       │   └── CheckAuth.tsx
    │       └── todo/
    │           ├── todoSlice.ts     # Offline todos reducer (entity adapter, no sortComparer)
    │           └── todoApiSlice.ts  # RTK Query endpoints for online todos
    └── api/
        ├── users/todos/[userId]/route.ts   # GET — fetch all todos for a user
        ├── todos/
        │   ├── new/[userId]/route.ts       # POST — create a new todo
        │   ├── delete/[userId]/route.ts    # POST — delete a todo
        │   ├── check/route.ts             # POST — toggle completed status
        │   └── reorder/[userId]/route.ts  # POST — persist drag-and-drop order
        └── auth/
            ├── google/generateLink/route.ts
            ├── google/callback/route.ts
            └── refresh/route.ts
```

---

## Data Models

### `User` (MongoDB)
```ts
{
  email: string,
  picture: string,
  name: string,
  todos: ObjectId[]   // ordered array — defines the fetch/display order
}
```

### `Todo` (MongoDB)
```ts
{
  title: string,
  completed: boolean,
  userId: ObjectId,
  createdAt: Date,    // automatic (timestamps: true)
  updatedAt: Date,    // automatic (timestamps: true)
}
```

---

## Authentication Flow

1. User clicks **Sign In with Google** → `GET /api/auth/google/generateLink` → redirects to Google.
2. Google redirects to `GET /api/auth/google/callback` → server issues a short-lived **access token** (JWT, signed with `JWT_ACCESS_TOKEN_SECRET`) and a longer-lived **refresh token** (JWT, signed with `JWT_REFRESH_TOKEN_SECRET`, stored in an HttpOnly cookie).
3. The access token is stored in Redux (`auth.token`) and sent as `Authorization: Bearer <token>` on every API request via `apiSlice.ts`.
4. When a request returns **403** (token expired), `baseQueryWithReauth` in `apiSlice.ts` automatically calls `GET /api/auth/refresh` to get a new access token, then retries the original request.
5. `src/middleware.ts` guards all `/api/todos/*` and `/api/users/*` routes using `jwtVerify` from `jose`.

---

## Online Todo Flow (authenticated)

### Fetching
- `useGetTodosQuery({ userId })` → `GET /api/users/todos/:userId`
- The server calls `User.findById(userId).populate('todos')`, which returns todos in the order of `user.todos[]`.
- `transformResponse` normalizes each todo (`id = _id`) and feeds them into an RTK Query entity adapter (**no `sortComparer`** — server order is authoritative).

### Creating
- `useAddTodoMutation` → `POST /api/todos/new/:userId`
- Optimistic update: a temp item (`isTemp: true`, `id: crypto.randomUUID()`) is added to the cache immediately; replaced with the real document once the server responds.

### Deleting
- `useDeleteTodoMutation` → `POST /api/todos/delete/:userId`
- Optimistic update: item removed from cache immediately; rolled back on failure.

### Checking (toggle completed)
- `useCheckTodoMutation` → `POST /api/todos/check`
- Optimistic update: `completed` flipped immediately; rolled back on failure.

### Reordering (drag-and-drop — persistent)
- `useReorderTodosMutation` → `POST /api/todos/reorder/:userId`
- Payload: `{ orderedIds: string[] }` — the full ordered list of todo IDs after a drag.
- Server validates that `orderedIds` is an exact permutation of `user.todos` (no additions/removals allowed), then saves the new order to `user.todos`.
- Optimistic update: `draft.ids` in the cache is updated immediately; rolled back on failure.
- **`TodoList.tsx` (online)** keeps an `orderedIdsRef` in sync with every reorder so that `handleDragEnd` can read the final order synchronously without a stale closure.

---

## Offline Todo Flow (unauthenticated)

- Todos are stored in `localStorage` under the key `"todos"`.
- Display order is stored in `localStorage` under the key `"todoOrder"`.
- Redux slice `todoSlice.ts` manages the in-memory state (no `sortComparer`).
- On mount, `TodoList.tsx` (offline) hydrates Redux from `localStorage["todos"]` and reads `localStorage["todoOrder"]` for the display order.
- Drag-and-drop reorder dispatches `reorderTodos({ orderedIds })` to Redux and writes the new order to `localStorage["todoOrder"]`.

---

## State Management

| Slice | Key | Contents |
|-------|-----|----------|
| `apiSlice` | `api` | RTK Query cache (online todos, etc.) |
| `authSlice` | `auth` | `{ token: string \| null, isLoading: boolean }` |
| `errorSlice` | `error` | Global error messages |
| `todoSlice` | `todo` | Offline todos entity adapter |

---

## API Routes Reference

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/users/todos/:userId` | ✅ JWT | Fetch all todos for user (in stored order) |
| POST | `/api/todos/new/:userId` | ✅ JWT | Create a new todo |
| POST | `/api/todos/delete/:userId` | ✅ JWT | Delete a todo |
| POST | `/api/todos/check` | ✅ JWT | Toggle todo completed status |
| POST | `/api/todos/reorder/:userId` | ✅ JWT | Persist drag-and-drop order |
| GET | `/api/auth/google/generateLink` | ❌ | Start Google OAuth flow |
| GET | `/api/auth/google/callback` | ❌ | OAuth callback — issue tokens |
| GET | `/api/auth/refresh` | ❌ (cookie) | Refresh access token |
| GET | `/api/auth/logout` | ❌ | Clear refresh token cookie |

---

## Environment Variables

```env
NEXT_PUBLIC_BASE_URL=          # App base URL (e.g. http://localhost:3000)
MONGODB_URI=                   # MongoDB connection string
GOOGLE_CLIENT_ID=              # Google OAuth client ID
GOOGLE_CLIENT_SECRET=          # Google OAuth client secret
GOOGLE_REDIRECT_URI=           # Must match Google Cloud Console authorised redirect URI
JWT_ACCESS_TOKEN_SECRET=       # Strong random string for signing access tokens
JWT_REFRESH_TOKEN_SECRET=      # Strong random string for signing refresh tokens
```

---

## Scripts

```bash
npm run dev      # Start development server
npm run build    # Production build
npm run start    # Start production server
npm run lint     # ESLint (next lint)
npx tsc --noEmit # TypeScript type check (no test suite exists)
```

> There are no automated tests in this project. Validation is done via TypeScript (`tsc --noEmit`) and ESLint (`npm run lint`).

---

## Key Design Decisions & History

- **`user.todos[]` array as the order source of truth**: The `User` document stores an ordered array of todo ObjectIds. `populate('todos')` returns them in that order, so persisting drag order just means updating this array — no separate order field needed.
- **No `sortComparer` in entity adapters**: Both the online (`todoApiSlice.ts`) and offline (`todoSlice.ts`) entity adapters intentionally have no `sortComparer`. A comparator would override the user's saved drag order on every state update.
- **Optimistic updates throughout**: All mutations (add, delete, check, reorder) update the Redux/RTK Query cache immediately and roll back on server error.
- **`orderedIdsRef` pattern in online `TodoList`**: Since `handleDragEnd` is memoised with `useCallback`, a ref (`orderedIdsRef`) is kept in sync alongside the `orderedIds` state so the callback always reads the latest order without needing `orderedIds` in its dependency array.
- **Reorder validation on server**: `POST /api/todos/reorder/:userId` verifies that the submitted `orderedIds` is an exact permutation of the user's existing todos — preventing accidental or malicious addition/removal of items through the reorder endpoint.
