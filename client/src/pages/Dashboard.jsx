import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../components/Navbar';
import DashboardStats from '../components/DashboardStats';
import TaskCard from '../components/TaskCard';
import EmptyState from '../components/EmptyState';
import { useTaskStore } from '../store/taskStore';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const { user } = useAuth();
  const { summary, tasks, loadSummary, loadTasks, error } = useTaskStore();

  useEffect(() => {
    loadSummary();
    loadTasks();
  }, [loadSummary, loadTasks]);

  const upcoming = [...tasks]
    .filter((t) => t.status !== 'done')
    .sort((a, b) => {
      if (!a.due_date) return 1;
      if (!b.due_date) return -1;
      return new Date(a.due_date) - new Date(b.due_date);
    })
    .slice(0, 5);

  return (
    <div className="flex">
      <Navbar />
      <main className="min-h-screen flex-1 p-5 pb-24 md:pb-8 sm:p-8 max-w-5xl">
        <motion.header
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="mb-7"
        >
          <h1 className="font-display text-h1 font-medium tracking-tight">
            Welcome back{user?.name ? `, ${user.name.split(' ')[0]}` : ''}
          </h1>
          <p className="mt-1 text-body text-ink/55 dark:text-ink-dark/55">Here's where things stand today.</p>
        </motion.header>

        {error && <p className="mb-4 text-body text-rose">{error}</p>}

        <DashboardStats summary={summary} />

        <section className="mt-10">
          <h2 className="font-mono text-micro font-semibold uppercase tracking-widest text-ink/45 dark:text-ink-dark/45">
            Up next
          </h2>
          <div className="mt-3.5 space-y-2.5">
            {upcoming.length === 0 && (
              <EmptyState title="Nothing pending" subtitle="You're all caught up — nice work." />
            )}
            <AnimatePresence>
              {upcoming.map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
            </AnimatePresence>
          </div>
        </section>
      </main>
    </div>
  );
}
