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

  const ThemeIcon = (
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
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="sticky top-0 hidden md:flex h-screen w-60 shrink-0 flex-col justify-between px-3 py-5">
        <div>
          <div className="mb-9 flex items-center gap-2.5 px-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-accent-gradient font-display text-sm font-bold text-white shadow-glow">T</span>
            <span className="font-display text-h4 font-semibold tracking-tight">TaskFlow</span>
          </div>

          <nav className="flex flex-col gap-1">
            {NAV_ITEMS.map(({ to, label, icon: Icon }) => {
              const isActive = location.pathname === to;
              return (
                <NavLink key={to} to={to} className="relative flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-body font-medium">
                  {isActive && (
                    <motion.span
                      layoutId="nav-active-pill"
                      className="absolute inset-0 rounded-xl bg-accent/15 ring-1 ring-inset ring-accent/25 shadow-[0_0_18px_-6px_theme(colors.accent.DEFAULT)]"
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

        <div className="flex flex-col gap-1 border-t border-white/40 dark:border-white/10 pt-3">
          <div className="px-2 pb-2 text-micro text-ink/45 dark:text-ink-dark/45 font-mono truncate">{user?.email}</div>
          <button
            onClick={toggleTheme}
            className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-body font-medium text-ink/70 hover:bg-white/40 dark:text-ink-dark/70 dark:hover:bg-white/5 transition-colors"
          >
            {ThemeIcon}
            {theme === 'dark' ? 'Light mode' : 'Dark mode'}
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-body font-medium text-ink/70 hover:bg-rose/12 hover:text-rose dark:text-ink-dark/70 dark:hover:bg-rose/15 transition-colors"
          >
            <LogOut size={16} /> Log out
          </button>
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="glass-strong sticky top-0 z-30 flex md:hidden items-center justify-between border-0 border-b border-white/40 dark:border-white/10 px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-accent-gradient font-display text-xs font-bold text-white shadow-glow">T</span>
        <span className="font-display text-h4 font-semibold tracking-tight">TaskFlow</span>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={toggleTheme} aria-label="Toggle theme" className="rounded-xl p-2.5 min-h-[44px] min-w-[44px] text-ink/70 dark:text-ink-dark/70">
            {ThemeIcon}
          </button>
          <button onClick={handleLogout} aria-label="Log out" className="rounded-xl p-2.5 min-h-[44px] min-w-[44px] text-ink/70 dark:text-ink-dark/70">
            <LogOut size={16} />
          </button>
        </div>
      </div>

      {/* Mobile bottom tab bar */}
      <nav className="glass-strong fixed bottom-0 inset-x-0 z-30 flex md:hidden items-center justify-around border-0 border-t border-white/40 dark:border-white/10 px-2 py-1.5 pb-[max(0.375rem,env(safe-area-inset-bottom))]">
        {NAV_ITEMS.map(({ to, label, icon: Icon }) => {
          const isActive = location.pathname === to;
          return (
            <NavLink
              key={to}
              to={to}
              className={`relative flex min-h-[44px] flex-1 flex-col items-center justify-center gap-0.5 rounded-xl py-1.5 text-micro font-medium transition-colors ${
                isActive ? 'text-accent dark:text-accent-dark' : 'text-ink/50 dark:text-ink-dark/50'
              }`}
            >
              {isActive && (
                <motion.span
                  layoutId="nav-active-tab"
                  className="absolute inset-x-3 -top-0.5 h-0.5 rounded-full bg-accent shadow-[0_0_10px_theme(colors.accent.DEFAULT)]"
                  transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                />
              )}
              <Icon size={18} />
              {label}
            </NavLink>
          );
        })}
      </nav>
    </>
  );
}
