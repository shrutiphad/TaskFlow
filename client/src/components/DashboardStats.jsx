import { motion } from 'framer-motion';

const CELLS = (summary) => [
  { label: 'TOTAL TASKS', value: summary.total, tone: 'text-ink dark:text-ink-dark' },
  { label: 'TO DO', value: summary.byStatus.todo, tone: 'text-status-todo' },
  { label: 'IN PROGRESS', value: summary.byStatus.in_progress, tone: 'text-status-progress' },
  { label: 'DONE', value: summary.byStatus.done, tone: 'text-status-done' },
  { label: 'OVERDUE', value: summary.overdue, tone: 'text-priority-high' },
];

export default function DashboardStats({ summary }) {
  if (!summary) return null;
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
      {CELLS(summary).map((cell, i) => (
        <motion.div
          key={cell.label}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
          whileHover={{ y: -3 }}
          className="rounded-xl border border-line/70 dark:border-line-dark/70 bg-surface dark:bg-surface-dark p-4 shadow-soft hover:shadow-card dark:hover:shadow-card-dark transition-shadow duration-300"
        >
          <div className="font-mono text-[10.5px] font-medium tracking-wider text-ink/45 dark:text-ink-dark/45">{cell.label}</div>
          <div className={`mt-1.5 font-display text-3xl font-semibold tabular-nums ${cell.tone}`}>{cell.value}</div>
        </motion.div>
      ))}
    </div>
  );
}
