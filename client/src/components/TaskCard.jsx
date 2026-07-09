import { format, isPast } from 'date-fns';
import { Pencil, Trash2, CalendarDays } from 'lucide-react';
import { motion } from 'framer-motion';
import PriorityBadge from './PriorityBadge';
import StatusBadge from './StatusBadge';

/* Each priority carries a coloured light: a glowing left spine + a soft radial
   bloom that blooms brighter on hover. This is the card's signature. */
const PRIORITY = {
  low: {
    spine: 'before:bg-emerald before:shadow-[0_0_14px_2px_theme(colors.emerald.DEFAULT)]',
    glow: 'radial-gradient(120% 90% at 0% 0%, rgba(18,184,134,0.16), transparent 55%)',
  },
  medium: {
    spine: 'before:bg-amber before:shadow-[0_0_14px_2px_theme(colors.amber.DEFAULT)]',
    glow: 'radial-gradient(120% 90% at 0% 0%, rgba(224,138,0,0.16), transparent 55%)',
  },
  high: {
    spine: 'before:bg-rose before:shadow-[0_0_14px_2px_theme(colors.rose.DEFAULT)]',
    glow: 'radial-gradient(120% 90% at 0% 0%, rgba(240,65,107,0.18), transparent 55%)',
  },
};

export default function TaskCard({ task, onEdit, onDelete }) {
  const overdue = task.due_date && task.status !== 'done' && isPast(new Date(task.due_date + 'T23:59:59'));
  const p = PRIORITY[task.priority] || PRIORITY.medium;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8, scale: 0.97, transition: { duration: 0.18 } }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -4 }}
      data-testid="task-card"
      className={`group glass relative flex items-start justify-between gap-5 overflow-hidden rounded-2xl p-5 shadow-glass dark:shadow-glass-dark hover:shadow-glass-lg dark:hover:shadow-glass-lg-dark transition-shadow duration-300 before:absolute before:left-0 before:top-0 before:h-full before:w-[3px] before:rounded-r-full ${p.spine}`}
    >
      {/* priority bloom — brightens on hover */}
      <div
        className="pointer-events-none absolute inset-0 opacity-60 transition-opacity duration-500 group-hover:opacity-100"
        style={{ backgroundImage: p.glow }}
      />

      <div className="relative min-w-0 flex-1">
        <h3 className="font-display text-h4 font-semibold tracking-tight truncate">{task.title}</h3>
        <div className="mt-2 flex flex-wrap items-center gap-1.5">
          <StatusBadge status={task.status} />
          <PriorityBadge priority={task.priority} />
          {overdue && (
            <span className="rounded-full bg-rose-soft/80 dark:bg-rose/15 px-2 py-0.5 text-micro font-semibold text-rose dark:text-rose-dark ring-1 ring-inset ring-rose/25 shadow-[0_0_10px_-2px_theme(colors.rose.DEFAULT)]">
              Overdue
            </span>
          )}
        </div>
        {task.description && (
          <p className="mt-3 text-body text-ink/60 dark:text-ink-dark/60 line-clamp-2">{task.description}</p>
        )}
        {task.due_date && (
          <div className="mt-3 flex items-center gap-1.5 text-micro font-mono text-ink/45 dark:text-ink-dark/45">
            <CalendarDays size={13} />
            Due {format(new Date(task.due_date + 'T00:00:00'), 'd MMM yyyy')}
          </div>
        )}
      </div>
      {(onEdit || onDelete) && (
        <div className="relative flex shrink-0 gap-1 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300">
          {onEdit && (
            <button
              onClick={() => onEdit(task)}
              aria-label={`Edit ${task.title}`}
              className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl text-ink/45 hover:bg-accent/15 hover:text-accent dark:text-ink-dark/45 dark:hover:bg-accent/20 dark:hover:text-accent-dark transition-colors"
            >
              <Pencil size={15} />
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(task)}
              aria-label={`Delete ${task.title}`}
              className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl text-ink/45 hover:bg-rose/15 hover:text-rose dark:text-ink-dark/45 dark:hover:bg-rose/20 dark:hover:text-rose-dark transition-colors"
            >
              <Trash2 size={15} />
            </button>
          )}
        </div>
      )}
    </motion.div>
  );
}
