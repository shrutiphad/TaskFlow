import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';

// These tests render the REAL App component tree (App -> Router -> Auth/Theme
// providers -> real pages -> real components) and hit the REAL backend
// running on localhost:5000 against real Postgres. No mocked axios, no
// mocked components. This is as close to "a user clicking through the app"
// as is possible without an actual browser.
//
// IMPORTANT — responsive DOM note:
// Navbar and FilterSortBar each render a desktop layout AND a mobile layout
// simultaneously, toggled purely via Tailwind's `hidden` / `md:flex` /
// `sm:hidden` classes. This project's vitest.config.js does not set
// `test.css: true`, so jsdom never loads the real stylesheet and those
// breakpoint classes have no effect during tests — both layouts are present
// in the DOM at once. Concretely this means:
//   - "Dashboard" / "Tasks" nav links each appear twice (desktop sidebar +
//     mobile bottom tab bar)
//   - "Log out" appears twice (desktop sidebar text + mobile top bar
//     aria-label)
//   - "New task" appears twice (desktop filter bar + mobile filter bar)
// Any query for these must use getAllBy*(...)[0] rather than a singular
// getBy*/findBy*, or must be scoped with within() to a specific container.
// Task-card-level assertions (status/priority) are scoped via the
// `data-testid="task-card"` hook on TaskCard's root element rather than
// matching on className, so they stay stable across future visual changes.

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
    await screen.findByText(/total tasks/i, {}, { timeout: 3000 });
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

    // Navbar renders a desktop sidebar AND a mobile bottom tab bar at once
    // (see note above) — "Tasks" matches twice, so take the first.
    await user.click(screen.getAllByRole('link', { name: /tasks/i })[0]);
    expect(await screen.findByText('Create your first task')).toBeInTheDocument();

    // Create a task through the real modal. We deliberately enter via the
    // EmptyState's "Create your first task" button rather than the filter
    // bar's "New task" button, since the latter is duplicated (desktop +
    // mobile filter bars) and this one is not.
    await user.click(screen.getByRole('button', { name: /create your first task/i }));
    await screen.findByRole('heading', { name: 'New task' });
    await user.type(screen.getByPlaceholderText('e.g. Ship the onboarding flow'), 'Vitest smoke task');
    await user.click(screen.getByRole('button', { name: /^create task$/i }));

    // Real assertion: the task now appears in the real list, fetched from
    // the real API. Scope into the specific card via data-testid so this
    // stays robust to future className/markup changes.
    const taskTitle = await screen.findByText('Vitest smoke task');
    expect(taskTitle).toBeInTheDocument();

    const taskCard = taskTitle.closest('[data-testid="task-card"]');
    expect(taskCard).toBeTruthy();
    expect(within(taskCard).getByText(/to do/i)).toBeInTheDocument();

    // Edit it: change status to Done
    await user.click(within(taskCard).getByRole('button', { name: /edit vitest smoke task/i }));
    await screen.findByRole('heading', { name: 'Edit task' });
    await user.selectOptions(screen.getByLabelText('Status'), 'done');
    await user.click(screen.getByRole('button', { name: /save changes/i }));

    await waitFor(() => {
      expect(within(taskCard).getByText(/done/i)).toBeInTheDocument();
    });

    // Filter by "To Do" - the just-completed task should disappear from the list
    await user.selectOptions(screen.getByLabelText(/filter by status/i), 'todo');
    await waitFor(() => {
      expect(screen.queryByText('Vitest smoke task')).not.toBeInTheDocument();
    });

    // Reset filter, then delete with the real confirm dialog
    await user.selectOptions(screen.getByLabelText(/filter by status/i), '');
    const taskTitleAgain = await screen.findByText('Vitest smoke task');
    const taskCardAgain = taskTitleAgain.closest('[data-testid="task-card"]');

    await user.click(within(taskCardAgain).getByRole('button', { name: /delete vitest smoke task/i }));
    await screen.findByText('Delete this task?');
    await user.click(screen.getByRole('button', { name: /^delete$/i }));

    await waitFor(() => {
      expect(screen.queryByText('Vitest smoke task')).not.toBeInTheDocument();
    });
  }, 20000);
});