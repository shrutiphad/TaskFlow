import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { LayoutGrid, ListChecks, Moon, Sun, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutGrid },
  { to: '/tasks', label: 'Tasks', icon: ListChecks },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <aside className="sticky top-0 flex h-screen w-60 shrink-0 flex-col justify-between border-r border-line/70 dark:border-line-dark/70 bg-surface/80 dark:bg-surface-dark/80 backdrop-blur-xl px-3 py-5">
      <div>
        <div className="mb-9 flex items-center gap-2.5 px-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-accent to-accent-dark font-display text-sm font-bold text-white shadow-glow">
            T
          </span>
          <span className="font-display text-base font-semibold tracking-tight">Taskframe</span>
        </div>

        <nav className="flex flex-col gap-1">
          {NAV_ITEMS.map(({ to, label, icon: Icon }) => {
            const isActive = location.pathname === to;
            return (
              <NavLink key={to} to={to} className="relative flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium">
                {isActive && (
                  <motion.span
                    layoutId="nav-active-pill"
                    className="absolute inset-0 rounded-lg bg-accent-soft dark:bg-accent/15"
                    transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                  />
                )}
                <span className={`relative flex items-center gap-2.5 ${isActive ? 'text-accent dark:text-accent-dark' : 'text-ink/60 hover:text-ink dark:text-ink-dark/60 dark:hover:text-ink-dark'} transition-colors`}>
                  <Icon size={16} />
                  {label}
                </span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      <div className="flex flex-col gap-1 border-t border-line/70 dark:border-line-dark/70 pt-3">
        <div className="px-2 pb-2 text-xs text-ink/45 dark:text-ink-dark/45 font-mono truncate">{user?.email}</div>

        <button
          onClick={toggleTheme}
          className="group flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium text-ink/70 hover:bg-canvas dark:text-ink-dark/70 dark:hover:bg-canvas-dark transition-colors"
        >
          <span className="relative flex h-4 w-4 items-center justify-center">
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={theme}
                initial={{ opacity: 0, rotate: -90, scale: 0.6 }}
                animate={{ opacity: 1, rotate: 0, scale: 1 }}
                exit={{ opacity: 0, rotate: 90, scale: 0.6 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
                className="absolute"
              >
                {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
              </motion.span>
            </AnimatePresence>
          </span>
          {theme === 'dark' ? 'Light mode' : 'Dark mode'}
        </button>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium text-ink/70 hover:bg-priority-high/10 hover:text-priority-high dark:text-ink-dark/70 dark:hover:bg-priority-high/10 transition-colors"
        >
          <LogOut size={16} /> Log out
        </button>
      </div>
    </aside>
  );
}
