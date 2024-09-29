import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import Register from '../register';
import { useRouter } from 'next/router';

// Mock useRouter
jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

// Mock alert
global.alert = jest.fn();

describe('Register Component', () => {
  afterEach(() => {
    jest.clearAllMocks(); // Clear mocks after each test
  });

  it('should render the registration form', () => {
    render(<Register />);
    
    // Check if email, password input, and role dropdown are present
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Submitter')).toBeInTheDocument();
    expect(screen.getByText('Register')).toBeInTheDocument();
  });

  it('should display an error when registration fails', async () => {
    const mockPush = jest.fn();
    useRouter.mockImplementation(() => ({ push: mockPush }));

    // Mock fetch to simulate a failed registration
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve({ message: 'Username has been used' }),
      })
    );

    render(<Register />);

    fireEvent.change(screen.getByPlaceholderText('Email'), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { value: 'password123' },
    });
    fireEvent.click(screen.getByText('Register'));

    // Wait for the alert to be called
    expect(global.alert).toHaveBeenCalledWith('Registration failed, username has been used');
  });

  it('should redirect after successful registration', async () => {
    const mockPush = jest.fn();
    useRouter.mockImplementation(() => ({ push: mockPush }));

    // Mock fetch to simulate a successful registration
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({}),
      })
    );

    render(<Register />);

    fireEvent.change(screen.getByPlaceholderText('Email'), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { value: 'password123' },
    });
    fireEvent.click(screen.getByText('Register'));

    // Ensure the router push was called with the correct route
    expect(mockPush).toHaveBeenCalledWith('/login');
  });
});
