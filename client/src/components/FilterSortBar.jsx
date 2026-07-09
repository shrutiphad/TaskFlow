import { useState } from 'react';
import { ArrowUpDown, Plus, SlidersHorizontal, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const selectClass =
  'glass-input rounded-xl px-3 py-2.5 text-body outline-none transition-colors hover:border-accent/50 focus:border-accent';

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
          className="glass-input shrink-0 rounded-xl p-2.5 hover:border-accent/50 hover:text-accent transition-colors"
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
          className="ml-auto flex items-center gap-1.5 rounded-xl bg-accent-gradient px-4 py-2.5 text-body font-semibold text-white shadow-glow"
        >
          <Plus size={16} /> New task
        </motion.button>
      </div>

      {/* Mobile: trigger + bottom sheet */}
      <div className="flex sm:hidden items-center gap-2">
        <button
          onClick={() => setSheetOpen(true)}
          className="glass-input relative flex items-center gap-2 rounded-xl px-4 py-3 text-body font-medium min-h-[44px]"
        >
          <SlidersHorizontal size={16} />
          Filters
          {activeCount > 0 && (
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[10px] font-semibold text-white shadow-[0_0_8px_theme(colors.accent.DEFAULT)]">{activeCount}</span>
          )}
        </button>
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={onNewTask}
          className="ml-auto flex items-center gap-1.5 rounded-xl bg-accent-gradient px-4 py-3 text-body font-semibold text-white shadow-glow min-h-[44px]"
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
            className="fixed inset-0 z-50 flex items-end bg-ink/40 dark:bg-black/60 backdrop-blur-sm sm:hidden"
            onClick={() => setSheetOpen(false)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="glass-strong w-full rounded-t-3xl border-0 border-t border-white/50 dark:border-white/10 p-5 pb-[max(2rem,env(safe-area-inset-bottom))] shadow-glass-lg dark:shadow-glass-lg-dark"
         >
            <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-ink/15 dark:bg-white/15" />
            <div className="mb-4 flex items-center justify-between">
                <h2 className="font-display text-h4 font-semibold">Filter &amp; sort</h2>
                <button onClick={() => setSheetOpen(false)} aria-label="Close" className="rounded-lg p-2 hover:bg-white/40 dark:hover:bg-white/5">
                  <X size={18} />
                </button>
              </div>
              <div className="flex flex-col gap-3">
                <Controls filters={filters} onChange={onChange} stacked />
              </div>
              <button
                onClick={() => setSheetOpen(false)}
                className="mt-5 w-full rounded-xl bg-accent-gradient py-3 text-body font-semibold text-white shadow-glow min-h-[44px]"
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
