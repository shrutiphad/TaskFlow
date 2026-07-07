import { AnimatePresence, motion } from 'framer-motion';

export default function ConfirmDialog({ open, title, description, confirmLabel = 'Confirm', onConfirm, onCancel }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
          role="dialog"
          aria-modal="true"
          onClick={onCancel}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 4 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm rounded-xl border border-line dark:border-line-dark bg-surface dark:bg-surface-dark p-5 shadow-card dark:shadow-card-dark"
          >
            <h2 className="font-display text-base font-semibold">{title}</h2>
            <p className="mt-2 text-sm text-ink/65 dark:text-ink-dark/65">{description}</p>
            <div className="mt-5 flex justify-end gap-2">
              <button onClick={onCancel} className="rounded-lg px-3 py-2 text-sm font-medium hover:bg-canvas dark:hover:bg-canvas-dark transition-colors">
                Cancel
              </button>
              <button
                onClick={onConfirm}
                className="rounded-lg bg-priority-high px-3 py-2 text-sm font-medium text-white hover:opacity-90 transition-opacity"
              >
                {confirmLabel}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
