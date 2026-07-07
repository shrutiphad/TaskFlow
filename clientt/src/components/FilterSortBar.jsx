import { ArrowUpDown, Plus } from 'lucide-react';
import { motion } from 'framer-motion';

const selectClass =
  'rounded-lg border border-line dark:border-line-dark bg-surface dark:bg-surface-dark px-3 py-2 text-sm shadow-soft outline-none transition-colors hover:border-accent/40 focus:border-accent';

export default function FilterSortBar({ filters, onChange, onNewTask }) {
  return (
    <div className="mb-5 flex flex-wrap items-center gap-2">
      <select value={filters.status} onChange={(e) => onChange({ status: e.target.value })} className={selectClass} aria-label="Filter by status">
        <option value="">All statuses</option>
        <option value="todo">To Do</option>
        <option value="in_progress">In Progress</option>
        <option value="done">Done</option>
      </select>

      <select value={filters.priority} onChange={(e) => onChange({ priority: e.target.value })} className={selectClass} aria-label="Filter by priority">
        <option value="">All priorities</option>
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>

      <div className="flex items-center gap-1.5">
        <select value={filters.sortBy} onChange={(e) => onChange({ sortBy: e.target.value })} className={selectClass} aria-label="Sort field">
          <option value="created_at">Sort: Created date</option>
          <option value="due_date">Sort: Due date</option>
        </select>
        <button
          onClick={() => onChange({ order: filters.order === 'asc' ? 'desc' : 'asc' })}
          className="rounded-lg border border-line dark:border-line-dark bg-surface dark:bg-surface-dark p-2 shadow-soft hover:border-accent/40 hover:text-accent transition-colors"
          aria-label="Toggle sort order"
          title={filters.order === 'asc' ? 'Ascending' : 'Descending'}
        >
          <ArrowUpDown size={15} />
        </button>
      </div>

      <motion.button
        whileHover={{ scale: 1.02, y: -1 }}
        whileTap={{ scale: 0.97 }}
        onClick={onNewTask}
        className="ml-auto flex items-center gap-1.5 rounded-lg bg-gradient-to-br from-accent to-accent-dark px-3.5 py-2 text-sm font-medium text-white shadow-glow"
      >
        <Plus size={16} /> New task
      </motion.button>
    </div>
  );
}
