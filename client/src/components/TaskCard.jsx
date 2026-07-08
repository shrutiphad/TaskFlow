import { format, isPast } from 'date-fns';
import { Pencil, Trash2, CalendarDays } from 'lucide-react';
import { motion } from 'framer-motion';
import PriorityBadge from './PriorityBadge';
import StatusBadge from './StatusBadge';

const SPINE = {
  low: 'before:bg-emerald before:shadow-[0_0_10px_theme(colors.emerald.DEFAULT)]',
  medium: 'before:bg-amber before:shadow-[0_0_10px_theme(colors.amber.DEFAULT)]',
  high: 'before:bg-rose before:shadow-[0_0_10px_theme(colors.rose.DEFAULT)]',
};

export default function TaskCard({ task, onEdit, onDelete }) {
  const overdue = task.due_date && task.status !== 'done' && isPast(new Date(task.due_date + 'T23:59:59'));

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6, scale: 0.98, transition: { duration: 0.18 } }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -3 }}
      className={`group relative flex items-start justify-between gap-5 overflow-hidden rounded-2xl border border-line/70 dark:border-line-dark/70 bg-surface dark:bg-surface-dark p-5 shadow-xs hover:shadow-card dark:hover:shadow-card-dark hover:border-line dark:hover:border-line-dark/40 transition-[box-shadow,border-color] duration-300 before:absolute before:left-0 before:top-0 before:h-full before:w-[3px] before:rounded-r ${SPINE[task.priority]}`}
    >
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="font-display text-h4 font-medium tracking-tight truncate">{task.title}</h3>
        </div>
        <div className="mt-2 flex flex-wrap items-center gap-1.5">
          <StatusBadge status={task.status} />
          <PriorityBadge priority={task.priority} />
          {overdue && (
            <span className="rounded-md bg-rose-soft dark:bg-rose/12 px-2 py-0.5 text-micro font-semibold text-rose dark:text-rose-dark ring-1 ring-inset ring-rose/20">
              Overdue
            </span>
          )}
        </div>
        {task.description && (
          <p className="mt-3 text-body text-ink/60 dark:text-ink-dark/60 line-clamp-2">{task.description}</p>
        )}
        {task.due_date && (
          <div className="mt-3 flex items-center gap-1.5 text-micro font-mono text-ink/40 dark:text-ink-dark/40">
            <CalendarDays size={13} />
            Due {format(new Date(task.due_date + 'T00:00:00'), 'd MMM yyyy')}
          </div>
        )}
      </div>
      {(onEdit || onDelete) && (
         <div className="flex shrink-0 gap-1 sm:opacity-60 sm:group-hover:opacity-100 transition-opacity">
 
          {onEdit && (
            <button
              onClick={() => onEdit(task)}
              aria-label={`Edit ${task.title}`}
              className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg text-ink/40 hover:bg-accent-soft hover:text-accent dark:text-ink-dark/40 dark:hover:bg-accent/15 dark:hover:text-accent-dark transition-colors"

            >
              <Pencil size={15} />
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(task)}
              aria-label={`Delete ${task.title}`}
              className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg text-ink/40 hover:bg-rose-soft hover:text-rose dark:text-ink-dark/40 dark:hover:bg-rose/12 dark:hover:text-rose-dark transition-colors"

            >
              <Trash2 size={15} />
            </button>
          )}
        </div>
      )}
    </motion.div>
  );
}
