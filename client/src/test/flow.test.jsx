import { describe, it, expect, beforeAll, beforeEach } from 'vitest';
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
//
// ROBUSTNESS note:
// Anything that round-trips to the real backend is given the `NET` timeout
// below rather than Testing Library's 1000ms default. GitHub's ubuntu runners
// plus a cold Postgres service container are much slower than a warm local
// box, and a mutation (create/edit/delete) is a write *followed by* a refetch
// — comfortably over 1s under CI load. Under-scoped waits are the single
// biggest source of flaky integration tests, so every backend-bound findBy*/
// waitFor here passes an explicit, generous timeout.

// Generous ceiling for a single backend round-trip (write + refetch). This is
// a MAX, not a delay — fast responses resolve immediately. Per-test timeouts
// below are sized above the sum of the network waits each test performs.
const NET = 8000;

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

const uniqueEmail = () => `vitest.${Date.now()}.${Math.random().toString(36).slice(2)}@example.com`;

// The password every seeded user shares — kept in one place so the login flow
// and the register helper can't disagree on it.
const PASSWORD = 'Password1';

// Register a fresh, isolated user and wait until the dashboard has rendered
// real data. Returns the generated email so flows that need to log back in
// have the credentials. Shared by the flows below so the setup can't drift.
async function registerAndLandOnDashboard(user, name) {
  const email = uniqueEmail();
  window.history.pushState({}, '', '/register');
  render(<App />);
  await screen.findByText('Create your account', {}, { timeout: NET });
  await user.type(screen.getByPlaceholderText('Jane Doe'), name);
  await user.type(screen.getByPlaceholderText('you@example.com'), email);
  await user.type(screen.getByPlaceholderText('At least 8 characters, 1 number'), PASSWORD);
  await user.type(screen.getByPlaceholderText('Re-enter password'), PASSWORD);
  await user.click(screen.getByRole('button', { name: /create account/i }));
  await screen.findByText(/welcome back/i, {}, { timeout: NET });
  return email;
}

// Create a task through the real modal and wait for it to appear in the list.
// The filter bar's "New task" button exists whether or not the list is empty,
// but it's duplicated (desktop + mobile bars), so take the first.
async function createTask(user, { title, priority }) {
  await user.click(screen.getAllByRole('button', { name: /new task/i })[0]);
  await screen.findByRole('heading', { name: 'New task' });
  await user.type(screen.getByPlaceholderText('e.g. Ship the onboarding flow'), title);
  if (priority) await user.selectOptions(screen.getByLabelText('Priority'), priority);
  await user.click(screen.getByRole('button', { name: /^create task$/i }));
  await screen.findByText(title, {}, { timeout: NET });
}

// Re-locate a task's card by its title every time we need it, instead of
// holding a reference across a mutation. After an edit/filter the list is
// refetched and re-rendered; a captured DOM node can end up detached, so
// always query fresh.
const cardFor = (title) => screen.getByText(title).closest('[data-testid="task-card"]');

// Fail fast with an actionable message if the backend isn't reachable, rather
// than surfacing a confusing 1s render timeout deep inside the first test.
// Mirrors what CI guarantees via `npx wait-on http://localhost:5000/api/health`.
beforeAll(async () => {
  try {
    const res = await fetch(`${API_BASE}/health`);
    if (!res.ok) throw new Error(`health check returned ${res.status}`);
  } catch (err) {
    throw new Error(
      `Backend not reachable at ${API_BASE}. Start the server before running these ` +
        `integration tests (CI does this with wait-on ${API_BASE}/health). ` +
        `Underlying error: ${err.message}`
    );
  }
});

beforeEach(() => {
  localStorage.clear();
});

describe('Register -> Dashboard -> Tasks full flow', () => {
  it('registers a new user and lands on the dashboard', async () => {
    const user = userEvent.setup();
    await registerAndLandOnDashboard(user, 'Vitest User');

    // Real assertion: did we actually land on the dashboard, with real data
    // fetched from the real /dashboard/summary endpoint?
    await screen.findByText(/total tasks/i, {}, { timeout: NET });
    expect(localStorage.getItem('token')).toBeTruthy();
  }, 20000);

  it('rejects registration when passwords do not match (client-side validation)', async () => {
    const user = userEvent.setup();
    window.history.pushState({}, '', '/register');
    render(<App />);

    // This flow never reaches the backend — validation fires client-side — so
    // the default timeouts are fine here.
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
    await registerAndLandOnDashboard(user, 'Task Flow User');

    // Navbar renders a desktop sidebar AND a mobile bottom tab bar at once
    // (see note above) — "Tasks" matches twice, so take the first.
    await user.click(screen.getAllByRole('link', { name: /tasks/i })[0]);
    expect(await screen.findByText('Create your first task', {}, { timeout: NET })).toBeInTheDocument();

    // Create a task through the real modal. We deliberately enter via the
    // EmptyState's "Create your first task" button rather than the filter
    // bar's "New task" button, since the latter is duplicated (desktop +
    // mobile filter bars) and this one is not.
    await user.click(screen.getByRole('button', { name: /create your first task/i }));
    await screen.findByRole('heading', { name: 'New task' });
    await user.type(screen.getByPlaceholderText('e.g. Ship the onboarding flow'), 'Vitest smoke task');
    await user.click(screen.getByRole('button', { name: /^create task$/i }));

    // Real assertion: the task now appears in the real list, fetched from
    // the real API (create + refetch → give it the network timeout). Scope
    // into the specific card via data-testid so this stays robust to future
    // className/markup changes.
    await screen.findByText('Vitest smoke task', {}, { timeout: NET });
    expect(within(cardFor('Vitest smoke task')).getByText(/to do/i)).toBeInTheDocument();

    // Edit it: change status to Done
    await user.click(within(cardFor('Vitest smoke task')).getByRole('button', { name: /edit vitest smoke task/i }));
    await screen.findByRole('heading', { name: 'Edit task' });
    await user.selectOptions(screen.getByLabelText('Status'), 'done');
    await user.click(screen.getByRole('button', { name: /save changes/i }));

    await waitFor(
      () => {
        expect(within(cardFor('Vitest smoke task')).getByText(/done/i)).toBeInTheDocument();
      },
      { timeout: NET }
    );

    // Filter by "To Do" - the just-completed task should disappear from the list
    await user.selectOptions(screen.getByLabelText(/filter by status/i), 'todo');
    await waitFor(
      () => {
        expect(screen.queryByText('Vitest smoke task')).not.toBeInTheDocument();
      },
      { timeout: NET }
    );

    // Reset filter, then delete with the real confirm dialog
    await user.selectOptions(screen.getByLabelText(/filter by status/i), '');
    await screen.findByText('Vitest smoke task', {}, { timeout: NET });

    await user.click(within(cardFor('Vitest smoke task')).getByRole('button', { name: /delete vitest smoke task/i }));
    await screen.findByText('Delete this task?');
    await user.click(screen.getByRole('button', { name: /^delete$/i }));

    await waitFor(
      () => {
        expect(screen.queryByText('Vitest smoke task')).not.toBeInTheDocument();
      },
      { timeout: NET }
    );
  }, 30000);
});

describe('Session, theme, and filtering flows', () => {
  it('logs out and logs back in with the same credentials', async () => {
    const user = userEvent.setup();
    const email = await registerAndLandOnDashboard(user, 'Session User');
    await screen.findByText(/total tasks/i, {}, { timeout: NET });

    // Log out — the control is duplicated (desktop sidebar text + mobile
    // top-bar aria-label), so take the first.
    await user.click(screen.getAllByRole('button', { name: /log out/i })[0]);

    // The login page's subtitle disambiguates it from the dashboard's own
    // "Welcome back, <name>" greeting (both contain "welcome back").
    expect(await screen.findByText(/log in to manage your tasks/i)).toBeInTheDocument();
    expect(localStorage.getItem('token')).toBeFalsy();

    // Log back in through the real /auth/login endpoint. The password field is
    // matched by its bullet placeholder (regex, so it survives a count change);
    // it's the only field on the page with one.
    await user.type(screen.getByPlaceholderText('you@example.com'), email);
    await user.type(screen.getByPlaceholderText(/•/), PASSWORD);
    await user.click(screen.getByRole('button', { name: /^log in$/i }));

    await screen.findByText(/total tasks/i, {}, { timeout: NET });
    expect(localStorage.getItem('token')).toBeTruthy();
  }, 25000);

  it('toggles dark mode and persists the preference', async () => {
    const user = userEvent.setup();
    await registerAndLandOnDashboard(user, 'Theme User');

    // setup.js stubs matchMedia -> matches:false, so the app boots in light.
    expect(document.documentElement).not.toHaveClass('dark');

    // The mobile top-bar toggle carries a unique aria-label ("Toggle theme"),
    // unlike the desktop toggle which is labelled by its "Dark mode" text —
    // so this query is unambiguous.
    const toggle = screen.getByRole('button', { name: /toggle theme/i });

    await user.click(toggle);
    expect(document.documentElement).toHaveClass('dark');
    expect(localStorage.getItem('theme')).toBe('dark');

    await user.click(toggle);
    expect(document.documentElement).not.toHaveClass('dark');
    expect(localStorage.getItem('theme')).toBe('light');
  }, 20000);

  it('filters the task list by priority', async () => {
    const user = userEvent.setup();
    await registerAndLandOnDashboard(user, 'Filter User');

    await user.click(screen.getAllByRole('link', { name: /tasks/i })[0]);
    await screen.findByText('Create your first task', {}, { timeout: NET });

    await createTask(user, { title: 'Ship the release', priority: 'high' });
    await createTask(user, { title: 'Read a book someday', priority: 'low' });

    // Filter to High — the low-priority task should drop out of the list.
    // Assert the SETTLED state (high present AND low absent) in a single
    // waitFor: the filter refetch briefly swaps the list for loading
    // skeletons, so at one instant both titles are absent. Checking only the
    // low task's absence would pass during that loading gap, before the high
    // task re-renders.
    await user.selectOptions(screen.getByLabelText(/filter by priority/i), 'high');
    await waitFor(
      () => {
        expect(screen.getByText('Ship the release')).toBeInTheDocument();
        expect(screen.queryByText('Read a book someday')).not.toBeInTheDocument();
      },
      { timeout: NET }
    );

    // Clearing the filter brings it back.
    await user.selectOptions(screen.getByLabelText(/filter by priority/i), '');
    await screen.findByText('Read a book someday', {}, { timeout: NET });
  }, 30000);
});
