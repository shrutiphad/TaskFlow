import { useState } from 'react';
import { ArrowUpDown, Plus, SlidersHorizontal, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const selectClass =
  'rounded-xl border border-line dark:border-line-dark bg-surface dark:bg-surface-dark px-3 py-2.5 text-body outline-none transition-colors hover:border-accent/40 focus:border-accent';

function Controls({ filters, onChange, stacked }) {
  return (
    <>
      <select value={filters.status} onChange={(e) => onChange({ status: e.target.value })} className={`${selectClass} ${stacked ? 'w-full' : ''}`} aria-label="Filter by status">
        <option value="">All statuses</option>
        <option value="todo">To Do</option>
        <option value="in_progress">In Progress</option>
        <option value="done">Done</option>
      </select>

      <select value={filters.priority} onChange={(e) => onChange({ priority: e.target.value })} className={`${selectClass} ${stacked ? 'w-full' : ''}`} aria-label="Filter by priority">
        <option value="">All priorities</option>
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>

      <div className={`flex items-center gap-1.5 ${stacked ? 'w-full' : ''}`}>
        <select value={filters.sortBy} onChange={(e) => onChange({ sortBy: e.target.value })} className={`${selectClass} ${stacked ? 'w-full' : ''}`} aria-label="Sort field">
          <option value="created_at">Sort: Created date</option>
          <option value="due_date">Sort: Due date</option>
        </select>
        <button
          onClick={() => onChange({ order: filters.order === 'asc' ? 'desc' : 'asc' })}
          className="shrink-0 rounded-xl border border-line dark:border-line-dark bg-surface dark:bg-surface-dark p-2.5 hover:border-accent/40 hover:text-accent transition-colors"
          aria-label="Toggle sort order"
          title={filters.order === 'asc' ? 'Ascending' : 'Descending'}
        >
          <ArrowUpDown size={16} />
        </button>
      </div>
    </>
  );
}

export default function FilterSortBar({ filters, onChange, onNewTask }) {
  const [sheetOpen, setSheetOpen] = useState(false);
  const activeCount = [filters.status, filters.priority].filter(Boolean).length;

  return (
    <div className="mb-6">
      {/* Desktop: inline row */}
      <div className="hidden sm:flex flex-wrap items-center gap-2">
        <Controls filters={filters} onChange={onChange} />
        <motion.button
          whileHover={{ scale: 1.02, y: -1 }}
          whileTap={{ scale: 0.97 }}
          onClick={onNewTask}
          className="ml-auto flex items-center gap-1.5 rounded-xl bg-accent px-4 py-2.5 text-body font-medium text-white shadow-glow"
        >
          <Plus size={16} /> New task
        </motion.button>
      </div>

      {/* Mobile: trigger + bottom sheet */}
      <div className="flex sm:hidden items-center gap-2">
        <button
          onClick={() => setSheetOpen(true)}
          className="relative flex items-center gap-2 rounded-xl border border-line dark:border-line-dark bg-surface dark:bg-surface-dark px-4 py-3 text-body font-medium min-h-[44px]"
        >
          <SlidersHorizontal size={16} />
          Filters
          {activeCount > 0 && (
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[10px] font-semibold text-white">{activeCount}</span>
          )}
        </button>
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={onNewTask}
          className="ml-auto flex items-center gap-1.5 rounded-xl bg-accent px-4 py-3 text-body font-medium text-white shadow-glow min-h-[44px]"
        >
          <Plus size={16} /> New task
        </motion.button>
      </div>

      <AnimatePresence>
        {sheetOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end bg-black/40 backdrop-blur-sm sm:hidden"
            onClick={() => setSheetOpen(false)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="w-full rounded-t-2xl border-t border-line dark:border-line-dark bg-surface dark:bg-surface-dark p-5 pb-[max(2rem,env(safe-area-inset-bottom))] shadow-card dark:shadow-card-dark"
         >
            <div className="mb-4 flex items-center justify-between">
                <h2 className="font-display text-h4 font-medium">Filter & sort</h2>
                <button onClick={() => setSheetOpen(false)} aria-label="Close" className="rounded-lg p-2 hover:bg-canvas dark:hover:bg-canvas-dark">
                  <X size={18} />
                </button>
              </div>
              <div className="flex flex-col gap-3">
                <Controls filters={filters} onChange={onChange} stacked />
              </div>
              <button
                onClick={() => setSheetOpen(false)}
                className="mt-5 w-full rounded-xl bg-accent py-3 text-body font-medium text-white shadow-glow min-h-[44px]"
              >
                Show results
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
