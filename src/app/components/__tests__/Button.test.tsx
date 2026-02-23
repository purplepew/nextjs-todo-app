/**
 * EXAMPLE 2: Testing React Components with React Testing Library
 * 
 * This demonstrates:
 * - render() - Renders a component in a virtual DOM
 * - screen queries - Find elements in the rendered component
 * - User events - Simulate user interactions
 * - Accessibility testing - Check for proper semantic HTML
 */

import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

/**
 * Simple Button Component to Test
 * In a real project, this would be in its own file: components/Button.tsx
 */
const Button: React.FC<{
  onClick?: () => void
  disabled?: boolean
  children: React.ReactNode
}> = ({ onClick, disabled = false, children }) => (
  <button onClick={onClick} disabled={disabled}>
    {children}
  </button>
)

describe('Button Component', () => {
  /**
   * Test 1: Component Rendering
   * 
   * render() creates a virtual representation of your component
   * screen.getByText() finds elements by their text content
   * This tests the component renders without crashing
   */
  it('should render with the provided text', () => {
    render(<Button>Click me</Button>)
    
    // screen.getByText() throws an error if element not found
    // This ensures the button text is rendered
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })

  /**
   * Test 2: User Interactions
   * 
   * jest.fn() creates a mock function to track calls
   * fireEvent.click() simulates a click event
   * This tests that clicking the button calls the onClick handler
   */
  it('should call onClick handler when clicked', () => {
    // Arrange - create a mock function to track calls
    const handleClick = jest.fn()
    
    // Render component with the mock handler
    render(<Button onClick={handleClick}>Click me</Button>)
    
    // Act - find the button and click it
    const button = screen.getByText('Click me')
    fireEvent.click(button)
    
    // Assert - verify the handler was called
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  /**
   * Test 3: Component Props
   * 
   * This tests that the disabled prop works correctly
   */
  it('should be disabled when disabled prop is true', () => {
    render(<Button disabled>Click me</Button>)
    
    // getByRole() is more accessible than getByText()
    // It mimics how users interact with components
    const button = screen.getByRole('button')
    
    // Assert the button is disabled
    expect(button).toBeDisabled()
  })

  /**
   * Test 4: Multiple Assertions
   * 
   * You can make multiple assertions in one test
   * This tests the button's initial state
   */
  it('should have correct attributes', () => {
    render(<Button>Click me</Button>)
    
    const button = screen.getByRole('button')
    
    // Multiple assertions - all must pass
    expect(button).toBeInTheDocument()
    expect(button).toBeEnabled()
    expect(button).toHaveTextContent('Click me')
  })
})

/**
 * React Testing Library Best Practices:
 * 
 * 1. QUERY PRIORITY (use in this order):
 *    ✅ getByRole('button')          - Most accessible
 *    ✅ getByLabelText('Label')      - Good for forms
 *    ✅ getByPlaceholderText('...')  - For input fields
 *    ✅ getByText('...')             - For text content
 *    ⚠️  getByTestId('...')           - Last resort
 * 
 * 2. QUERY VARIANTS:
 *    getBy*()    - Throws error if not found (use for things that MUST exist)
 *    queryBy*()  - Returns null if not found (use to verify NOT in DOM)
 *    findBy*()   - Async, waits for element (use for async renders)
 * 
 * 3. COMMON ASSERTIONS:
 *    toBeInTheDocument()   - Element exists in DOM
 *    toBeDisabled()        - Button/input is disabled
 *    toHaveTextContent()   - Has specific text
 *    toHaveClass()         - Has CSS class
 *    toHaveAttribute()     - Has HTML attribute
 * 
 * 4. USER INTERACTIONS:
 *    fireEvent.click()     - Simulate click
 *    fireEvent.change()    - Simulate input change
 *    fireEvent.submit()    - Simulate form submit
 *    userEvent.type()      - Type text (more realistic)
 * 
 * 5. TESTING PRINCIPLES:
 *    - Test BEHAVIOR not implementation details
 *    - Write tests from user perspective
 *    - Avoid testing internal state
 *    - Mock external dependencies (API calls, etc.)
 */

/**
 * Example Test with Async Behavior:
 * 
 * If your component shows/hides content based on async operations
 */
const AsyncButton: React.FC = () => {
  const [loading, setLoading] = React.useState(false)
  const [result, setResult] = React.useState('')

  const handleClick = async () => {
    setLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 100))
    setResult('Success!')
    setLoading(false)
  }

  return (
    <div>
      <button onClick={handleClick} disabled={loading}>
        {loading ? 'Loading...' : 'Click me'}
      </button>
      {result && <p>{result}</p>}
    </div>
  )
}

describe('AsyncButton Component', () => {
  it('should show loading state and then result', async () => {
    render(<AsyncButton />)
    
    // Initially, button should say "Click me"
    expect(screen.getByRole('button')).toHaveTextContent('Click me')
    
    // Click the button
    fireEvent.click(screen.getByRole('button'))
    
    // findBy* is async - it waits for the element to appear
    // This waits for the result to be displayed (up to 1 second by default)
    const resultElement = await screen.findByText('Success!')
    
    expect(resultElement).toBeInTheDocument()
  })
})
