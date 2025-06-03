import '@testing-library/jest-dom'
import { render, screen} from '@testing-library/react'
import NewTodoForm from '../app/todo/components/NewTodoForm'

describe('Page', () => {
  it('renders a heading', () => {
    render(<NewTodoForm />)
 
    const button = screen.getByRole('button')
 
    expect(button).toBeInTheDocument() //failed
  })
})