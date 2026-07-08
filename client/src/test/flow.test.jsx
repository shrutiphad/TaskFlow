import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';

// These tests render the REAL App component tree (App -> Router -> Auth/Theme
// providers -> real pages -> real components) and hit the REAL backend
// running on localhost:5000 against real Postgres. No mocked axios, no
// mocked components. This is as close to "a user clicking through the app"
// as is possible without an actual browser.

const uniqueEmail = () => `vitest.${Date.now()}.${Math.random().toString(36).slice(2)}@example.com`;

beforeEach(() => {
  localStorage.clear();
});

describe('Register -> Dashboard -> Tasks full flow', () => {
  it('registers a new user and lands on the dashboard', async () => {
    const user = userEvent.setup();
    window.history.pushState({}, '', '/register');
    render(<App />);

    expect(await screen.findByText('Create your account')).toBeInTheDocument();

    const email = uniqueEmail();
    await user.type(screen.getByPlaceholderText('Jane Doe'), 'Vitest User');
    await user.type(screen.getByPlaceholderText('you@example.com'), email);
    await user.type(screen.getByPlaceholderText('At least 8 characters, 1 number'), 'Password1');
    await user.type(screen.getByPlaceholderText('Re-enter password'), 'Password1');
    await user.click(screen.getByRole('button', { name: /create account/i }));

    // Real assertion: did we actually land on the dashboard, with real data
    // fetched from the real /dashboard/summary endpoint?
    expect(await screen.findByText(/welcome back/i)).toBeInTheDocument();
    expect(await screen.findByText('TOTAL TASKS')).toBeInTheDocument();
    expect(localStorage.getItem('token')).toBeTruthy();
  }, 15000);

  it('rejects registration when passwords do not match (client-side validation)', async () => {
    const user = userEvent.setup();
    window.history.pushState({}, '', '/register');
    render(<App />);

    await screen.findByText('Create your account');
    await user.type(screen.getByPlaceholderText('Jane Doe'), 'Mismatch User');
    await user.type(screen.getByPlaceholderText('you@example.com'), uniqueEmail());
    await user.type(screen.getByPlaceholderText('At least 8 characters, 1 number'), 'Password1');
    await user.type(screen.getByPlaceholderText('Re-enter password'), 'Password2');
    await user.click(screen.getByRole('button', { name: /create account/i }));

    expect(await screen.findByText('Passwords do not match')).toBeInTheDocument();
    // Confirms we did NOT navigate away - still on the register form
    expect(screen.getByText('Create your account')).toBeInTheDocument();
  });

  it('full task lifecycle: create, see it in the list, edit it, filter, delete it', async () => {
    const user = userEvent.setup();

    // Register a fresh user for isolation, then land on dashboard
    window.history.pushState({}, '', '/register');
    render(<App />);
    await screen.findByText('Create your account');
    await user.type(screen.getByPlaceholderText('Jane Doe'), 'Task Flow User');
    await user.type(screen.getByPlaceholderText('you@example.com'), uniqueEmail());
    await user.type(screen.getByPlaceholderText('At least 8 characters, 1 number'), 'Password1');
    await user.type(screen.getByPlaceholderText('Re-enter password'), 'Password1');
    await user.click(screen.getByRole('button', { name: /create account/i }));
    await screen.findByText(/welcome back/i);

    // Navigate to Tasks via the real Navbar link
    await user.click(screen.getByRole('link', { name: /tasks/i }));
    expect(await screen.findByText('Create your first task')).toBeInTheDocument();

    // Create a task through the real modal
    await user.click(screen.getByRole('button', { name: /create your first task/i }));
    await screen.findByRole('heading', { name: 'New task' });
    await user.type(screen.getByPlaceholderText('e.g. Ship the onboarding flow'), 'Vitest smoke task');
    await user.click(screen.getByRole('button', { name: /^create task$/i }));

    // Real assertion: the task now appears in the real list, fetched from the real API
    const taskTitle = await screen.findByText('Vitest smoke task');
    const taskCard = taskTitle.closest('div.rounded-lg');
    expect(within(taskCard).getByText('To Do')).toBeInTheDocument();

    // Edit it: change status to Done
    await user.click(screen.getByRole('button', { name: /edit vitest smoke task/i }));
    await screen.findByRole('heading', { name: 'Edit task' });
    await user.selectOptions(screen.getByLabelText('Status'), 'done');
    await user.click(screen.getByRole('button', { name: /save changes/i }));

    await waitFor(() => {
      expect(within(taskCard).getByText('Done')).toBeInTheDocument();
    });

    // Filter by "To Do" - the just-completed task should disappear from the list
    await user.selectOptions(screen.getByLabelText(/filter by status/i), 'todo');
    await waitFor(() => {
      expect(screen.queryByText('Vitest smoke task')).not.toBeInTheDocument();
    });

    // Reset filter, then delete with the real confirm dialog
    await user.selectOptions(screen.getByLabelText(/filter by status/i), '');
    await screen.findByText('Vitest smoke task');

    await user.click(screen.getByRole('button', { name: /delete vitest smoke task/i }));
    await screen.findByText('Delete this task?');
    await user.click(screen.getByRole('button', { name: /^delete$/i }));

    await waitFor(() => {
      expect(screen.queryByText('Vitest smoke task')).not.toBeInTheDocument();
    });
  }, 20000);
});
