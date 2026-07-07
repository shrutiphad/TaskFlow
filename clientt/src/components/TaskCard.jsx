import { format, isPast } from 'date-fns';
import { Pencil, Trash2, CalendarDays } from 'lucide-react';
import { motion } from 'framer-motion';
import PriorityBadge from './PriorityBadge';
import StatusBadge from './StatusBadge';

const SPINE = {
  low: 'before:bg-priority-low',
  medium: 'before:bg-priority-medium',
  high: 'before:bg-priority-high',
};

export default function TaskCard({ task, onEdit, onDelete }) {
  const overdue = task.due_date && task.status !== 'done' && isPast(new Date(task.due_date + 'T23:59:59'));

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6, transition: { duration: 0.15 } }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -2 }}
      className={`relative flex items-start justify-between gap-4 overflow-hidden rounded-xl border border-line/70 dark:border-line-dark/70 bg-surface dark:bg-surface-dark p-4 shadow-soft hover:shadow-card dark:hover:shadow-card-dark transition-shadow duration-300 before:absolute before:left-0 before:top-0 before:h-full before:w-1 ${SPINE[task.priority]}`}
    >
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="font-display text-sm font-semibold truncate">{task.title}</h3>
          <StatusBadge status={task.status} />
          <PriorityBadge priority={task.priority} />
          {overdue && (
            <span className="rounded-md bg-priority-high/10 px-2 py-1 text-[11px] font-semibold text-priority-high ring-1 ring-inset ring-priority-high/20">
              Overdue
            </span>
          )}
        </div>
        {task.description && (
          <p className="mt-1.5 text-sm text-ink/65 dark:text-ink-dark/65 line-clamp-2">{task.description}</p>
        )}
        {task.due_date && (
          <div className="mt-2.5 flex items-center gap-1.5 text-xs font-mono text-ink/45 dark:text-ink-dark/45">
            <CalendarDays size={13} />
            Due {format(new Date(task.due_date + 'T00:00:00'), 'd MMM yyyy')}
          </div>
        )}
      </div>
      {(onEdit || onDelete) && (
        <div className="flex shrink-0 gap-1">
          {onEdit && (
            <button
              onClick={() => onEdit(task)}
              aria-label={`Edit ${task.title}`}
              className="rounded-md p-2 text-ink/40 hover:bg-accent-soft hover:text-accent dark:text-ink-dark/40 dark:hover:bg-accent/15 dark:hover:text-accent-dark transition-colors"
            >
              <Pencil size={15} />
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(task)}
              aria-label={`Delete ${task.title}`}
              className="rounded-md p-2 text-ink/40 hover:bg-priority-high/10 hover:text-priority-high dark:text-ink-dark/40 transition-colors"
            >
              <Trash2 size={15} />
            </button>
          )}
        </div>
      )}
    </motion.div>
  );
}
