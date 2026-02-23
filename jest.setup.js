/**
 * Jest Setup File
 * 
 * This file runs BEFORE each test suite.
 * It's perfect for importing global test utilities and configuring
 * the testing environment for all your tests.
 */

// Import testing library matchers for DOM assertions
import '@testing-library/jest-dom'

/**
 * OPTIONAL: Add global test utilities or mock setup here.
 * 
 * Uncomment to mock environment variables for all tests:
 * process.env.NEXT_PUBLIC_API_URL = 'http://localhost:3000'
 */
