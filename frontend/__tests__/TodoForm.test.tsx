import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import TodoForm from '@/components/TodoForm';

describe('TodoForm', () => {
  const mockOnSubmit = jest.fn();
  const mockOnCancel = jest.fn();

  beforeEach(() => {
    mockOnSubmit.mockClear();
    mockOnCancel.mockClear();
  });

  it('renders form fields correctly', () => {
    render(
      <TodoForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />
    );

    expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
  });

  it('submits form with correct data', async () => {
    const user = userEvent.setup();
    render(
      <TodoForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />
    );

    await user.type(screen.getByLabelText(/title/i), 'Test Todo');
    await user.type(screen.getByLabelText(/description/i), 'Test Description');
    await user.click(screen.getByRole('button', { name: /save/i }));

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        title: 'Test Todo',
        description: 'Test Description',
        priority: 0
      });
    });
  });

  it('calls onCancel when cancel button is clicked', async () => {
    const user = userEvent.setup();
    render(
      <TodoForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />
    );

    await user.click(screen.getByRole('button', { name: /cancel/i }));

    expect(mockOnCancel).toHaveBeenCalled();
  });

  it('does not submit with empty title', async () => {
    const user = userEvent.setup();
    render(
      <TodoForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />
    );

    await user.click(screen.getByRole('button', { name: /save/i }));

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });
});
