/**
 * EXAMPLE 1: Testing Utility Functions
 * 
 * This test file demonstrates the basics of Jest:
 * - describe() groups related tests
 * - it() or test() defines individual test cases
 * - Assertions check that your code works correctly
 * - beforeEach() runs before each test
 * - afterEach() runs after each test
 */

// Example utility function to test
const wait = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

// Group related tests using describe()
describe('wait() utility function', () => {
  /**
   * Anatomy of a test:
   * it('should do something', async () => {
   *    // Arrange: Set up test data
   *    // Act: Call the function being tested
   *    // Assert: Check the result matches expectations
   * })
   */
  it('should resolve after specified milliseconds', async () => {
    // Arrange & Act
    const startTime = Date.now()
    await wait(100)
    const endTime = Date.now()
    
    // Assert: Use expect() to check results
    // The elapsed time should be >= 100ms (allow some variance)
    expect(endTime - startTime).toBeGreaterThanOrEqual(100)
  })

  it('should resolve with undefined', async () => {
    // Assert: Promises can be tested with resolves
    await expect(wait(10)).resolves.toBeUndefined()
  })
})

/**
 * Jest Matchers - Common assertion methods:
 * expect(value).toBe(expected)           - Exact equality (===)
 * expect(value).toEqual(expected)        - Deep equality (for objects/arrays)
 * expect(value).toContain(item)          - Array/string contains item
 * expect(value).toHaveLength(length)     - Array/string length
 * expect(value).toBeNull(), toBeUndefined()
 * expect(value).toBeTruthy(), toBeFalsy()
 * expect(value).toThrow(error)           - Function throws error
 * expect(value).toBeGreaterThan(num)     - Numeric comparison
 * expect(() => fn()).toHaveBeenCalled()  - Mock function was called
 */

// Test for a mock example
describe('Mock Functions', () => {
  it('should track function calls', () => {
    // jest.fn() creates a mock function you can track
    const mockCallback = jest.fn()
    
    // Call the mock function
    mockCallback('argument 1')
    mockCallback('argument 2')
    
    // Assert the mock was called correctly
    expect(mockCallback).toHaveBeenCalledTimes(2)
    expect(mockCallback).toHaveBeenCalledWith('argument 1')
    expect(mockCallback).toHaveBeenNthCalledWith(2, 'argument 2')
  })

  it('should return mock values', () => {
    // Create a mock that returns specific values
    const mockFn = jest.fn()
      .mockReturnValue('default return')
      .mockReturnValueOnce('first call')  // First call returns 'first call'
    
    expect(mockFn()).toBe('first call')
    expect(mockFn()).toBe('default return')
    expect(mockFn()).toBe('default return')
  })
})

/**
 * Test Hooks - Execute code at specific times:
 * 
 * beforeAll()  - Once before all tests in this describe block
 * afterAll()   - Once after all tests in this describe block
 * beforeEach() - Before each individual test
 * afterEach()  - After each individual test
 */
describe('Test Hooks Example', () => {
  let testNumber: number

  beforeEach(() => {
    // This runs before EACH test - perfect for setup
    testNumber = 0
    console.log('Setting up test')
  })

  afterEach(() => {
    // This runs after EACH test - perfect for cleanup
    console.log('Cleaning up test')
  })

  it('should start with testNumber = 0', () => {
    expect(testNumber).toBe(0)
    testNumber += 5
  })

  it('should have reset testNumber to 0 again', () => {
    // testNumber was reset by beforeEach(), so it's 0 again
    expect(testNumber).toBe(0)
  })
})

/**
 * Key Jest Concepts Summary:
 * 
 * 1. DESCRIBE - Organize tests in groups
 *    describe('Component Name', () => { ... })
 * 
 * 2. TEST/IT - Define individual test cases
 *    it('should do something', () => { ... })
 * 
 * 3. EXPECT - Assert what the result should be
 *    expect(result).toBe(expected)
 * 
 * 4. MOCKS - Replace real functions with test versions
 *    jest.fn()
 * 
 * 5. HOOKS - Run code at specific times during tests
 *    beforeEach(), afterEach()
 * 
 * 6. ASYNC/AWAIT - Test async code
 *    it('should do async thing', async () => { ... })
 */
