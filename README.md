# Next.js Todo App

A full-stack todo application built with Next.js, featuring Google OAuth authentication, JWT-based session handling, and MongoDB data persistence.

## Features

- **Authentication** – Google Sign-In integration with JWT-based session handling
- **Middleware** – Validates JWT on every API request for secure access
- **Database** – MongoDB for storing user and todo data
- **Optimistic UI** – Instant UI updates for a smoother user experience before server confirmation

## Prerequisites

- [Node.js](https://nodejs.org/) v18 or later
- A [MongoDB](https://www.mongodb.com/) database (local or Atlas)
- A [Google Cloud](https://console.cloud.google.com/) project with OAuth 2.0 credentials

## Setup

### 1. Clone the repository

```bash
git clone https://github.com/purplepew/nextjs-todo-app.git
cd nextjs-todo-app
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env.local` file in the root of the project:

```bash
cp .env.example .env.local   # if an example file exists, otherwise create it manually
```

Open `.env.local` and fill in the values below:

```env
# Base URL of the application (e.g. http://localhost:3000)
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# MongoDB connection string
# Local example:  mongodb://localhost:27017/todoapp
# Atlas example:  mongodb+srv://<user>:<password>@cluster.mongodb.net/todoapp
MONGODB_URI=

# Google OAuth credentials
# Create these at https://console.cloud.google.com/apis/credentials
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# The URI Google redirects to after authentication.
# Must match the "Authorised redirect URIs" you set in the Google Cloud Console.
# Example: http://localhost:3000/api/auth/google/callback
GOOGLE_REDIRECT_URI=http://localhost:3000/api/auth/google/callback

# Secrets used to sign JWTs – use long, random strings (e.g. from `openssl rand -base64 32`)
JWT_ACCESS_TOKEN_SECRET=
JWT_REFRESH_TOKEN_SECRET=
```

> **Where to find / create each value**
>
> | Variable | Where to get it |
> |---|---|
> | `NEXT_PUBLIC_BASE_URL` | The URL your app is served from (`http://localhost:3000` for local dev) |
> | `MONGODB_URI` | Your MongoDB Atlas connection string or a local MongoDB URI |
> | `GOOGLE_CLIENT_ID` | [Google Cloud Console](https://console.cloud.google.com/apis/credentials) → your OAuth 2.0 client → Client ID |
> | `GOOGLE_CLIENT_SECRET` | Same OAuth 2.0 client → Client Secret |
> | `GOOGLE_REDIRECT_URI` | Must exactly match an entry in the *Authorised redirect URIs* list of your OAuth client |
> | `JWT_ACCESS_TOKEN_SECRET` | Any strong random string; generate with `openssl rand -base64 32` |
> | `JWT_REFRESH_TOKEN_SECRET` | Any strong random string; generate with `openssl rand -base64 32` |

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start the development server |
| `npm run build` | Create a production build |
| `npm run start` | Start the production server |
| `npm run lint` | Run ESLint |

