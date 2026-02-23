/**
 * EXAMPLE 3: Mocking and Testing API Calls
 * 
 * This demonstrates:
 * - jest.mock() - Replace entire modules
 * - Mock implementation - Replace function behavior
 * - Testing async API calls
 * - Handling errors in tests
 */

/**
 * Example API Service to Test
 * In a real project, this would be in: lib/api.ts
 */
const fetchUser = async (userId: string) => {
  const response = await fetch(`/api/users/${userId}`)
  if (!response.ok) {
    throw new Error('Failed to fetch user')
  }
  return response.json()
}

const updateUserName = async (userId: string, name: string) => {
  const response = await fetch(`/api/users/${userId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name }),
  })
  if (!response.ok) {
    throw new Error('Failed to update user')
  }
  return response.json()
}

/**
 * Test Suite for API Functions Using Mocks
 * 
 * We mock fetch to avoid making real API calls during tests
 * This makes tests:
 * - Fast (no network requests)
 * - Reliable (no external dependencies)
 * - Testable (we can simulate any response or error)
 */
describe('API Service Functions', () => {
  /**
   * Mock fetch globally for all tests in this suite
   * This replaces the real fetch with jest.fn()
   */
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks()
    
    // TypeScript: Cast global fetch for testing
    global.fetch = jest.fn()
  })

  /**
   * After all tests, restore the original fetch
   */
  afterAll(() => {
    jest.restoreAllMocks()
  })

  /**
   * Test 1: Successful API Call
   * 
   * This tests the happy path - when the API call succeeds
   */
  it('should fetch user data successfully', async () => {
    // Arrange - set up mock response
    const mockUser = { id: '123', name: 'John Doe', email: 'john@example.com' }
    
    // Mock fetch to return a successful response
    ;(global.fetch as jest.Mock).mockReturnValueOnce(
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockUser),
      } as Response)
    )

    // Act - call the function
    const result = await fetchUser('123')

    // Assert - verify the result and the fetch was called correctly
    expect(result).toEqual(mockUser)
    expect(global.fetch).toHaveBeenCalledWith('/api/users/123')
    expect(global.fetch).toHaveBeenCalledTimes(1)
  })

  /**
   * Test 2: API Error Handling
   * 
   * This tests error scenarios - when the API call fails
   */
  it('should throw error when fetch fails', async () => {
    // Arrange - mock a failed response
    ;(global.fetch as jest.Mock).mockReturnValueOnce(
      Promise.resolve({
        ok: false,
        status: 404,
      } as Response)
    )

    // Act & Assert - use toReject to test rejected promises
    await expect(fetchUser('999')).rejects.toThrow('Failed to fetch user')
  })

  /**
   * Test 3: POST/PUT Request with Data
   * 
   * This tests making requests that send data to the server
   */
  it('should update user name with correct request body', async () => {
    // Arrange
    const mockResponse = { id: '123', name: 'Jane Doe' }
    
    ;(global.fetch as jest.Mock).mockReturnValueOnce(
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      } as Response)
    )

    // Act
    const result = await updateUserName('123', 'Jane Doe')

    // Assert - verify both the result and the request was correct
    expect(result).toEqual(mockResponse)
    expect(global.fetch).toHaveBeenCalledWith(
      '/api/users/123',
      expect.objectContaining({
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'Jane Doe' }),
      })
    )
  })

  /**
   * Test 4: Network Error (connection failed)
   * 
   * This tests when the network request itself fails (no server response)
   */
  it('should handle network errors', async () => {
    // Arrange - mock fetch to throw an error
    ;(global.fetch as jest.Mock).mockRejectedValueOnce(
      new Error('Network error')
    )

    // Act & Assert - should propagate the error
    await expect(fetchUser('123')).rejects.toThrow('Network error')
  })
})

/**
 * Mocking Strategies:
 * 
 * 1. MOCK ENTIRE MODULE:
 *    jest.mock('./api')
 * 
 * 2. MOCK SPECIFIC FUNCTION:
 *    jest.fn()
 * 
 * 3. MOCK RETURN VALUE:
 *    mockFn.mockReturnValue(value)
 *    mockFn.mockReturnValueOnce(value)  // Only for next call
 * 
 * 4. MOCK ASYNC (Promises):
 *    mockFn.mockResolvedValue(value)    // Promise.resolve(value)
 *    mockFn.mockRejectedValue(error)    // Promise.reject(error)
 * 
 * 5. MOCK IMPLEMENTATION:
 *    mockFn.mockImplementation((args) => {
 *      // Custom behavior
 *    })
 * 
 * 6. INSPECT MOCK CALLS:
 *    expect(mockFn).toHaveBeenCalled()
 *    expect(mockFn).toHaveBeenCalledWith(arg1, arg2)
 *    expect(mockFn).toHaveBeenNthCalledWith(2, arg1)
 *    mockFn.mock.calls                    // Array of all calls
 *    mockFn.mock.lastCall                 // Last call arguments
 * 
 * 7. RESTORE MOCKS:
 *    jest.clearAllMocks()    // Clear call history
 *    jest.resetAllMocks()    // Clear + restore implementation
 *    jest.restoreAllMocks()  // Fully restore original
 */
