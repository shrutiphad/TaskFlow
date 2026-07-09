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
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 dark:bg-black/60 backdrop-blur-sm p-4"
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
            className="glass-strong w-full max-w-sm max-h-[90vh] overflow-y-auto rounded-3xl p-6 shadow-glass-lg dark:shadow-glass-lg-dark"
          >
            <h2 className="font-display text-h4 font-semibold">{title}</h2>
            <p className="mt-2 text-body text-ink/60 dark:text-ink-dark/60">{description}</p>
            <div className="mt-5 flex justify-end gap-2">
              <button onClick={onCancel} className="rounded-xl px-4 py-2.5 text-body font-medium hover:bg-white/40 dark:hover:bg-white/5 transition-colors min-h-[44px]">
                Cancel
              </button>
              <button
                onClick={onConfirm}
                className="rounded-xl bg-rose px-4 py-2.5 text-body font-semibold text-white shadow-[0_8px_24px_-6px_theme(colors.rose.DEFAULT)] hover:opacity-90 transition-opacity min-h-[44px]"
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
