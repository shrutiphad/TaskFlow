import { motion } from 'framer-motion';

export default function EmptyState({ title, subtitle, actionLabel, onAction }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center rounded-2xl border border-dashed border-line dark:border-line-dark px-6 py-16 text-center"
    >
      <motion.svg
        className="mb-5 animate-float"
        width="88" height="88" viewBox="0 0 88 88" fill="none" xmlns="http://www.w3.org/2000/svg"
      >
        <rect x="18" y="14" width="52" height="64" rx="8" className="fill-surface2 dark:fill-surface2-dark stroke-line dark:stroke-line-dark" strokeWidth="1.5" />
        <rect x="28" y="28" width="32" height="4" rx="2" className="fill-accent-soft dark:fill-accent/20" />
        <rect x="28" y="38" width="24" height="4" rx="2" className="fill-line dark:fill-line-dark" />
        <rect x="28" y="48" width="28" height="4" rx="2" className="fill-line dark:fill-line-dark" />
        <circle cx="62" cy="62" r="15" className="fill-emerald-soft dark:fill-emerald/15 stroke-emerald" strokeWidth="1.5" />
        <path d="M56 62l4 4 8-8" className="stroke-emerald" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      </motion.svg>
      <h3 className="font-display text-h4 font-medium">{title}</h3>
      {subtitle && <p className="mt-1.5 max-w-xs text-body text-ink/55 dark:text-ink-dark/55">{subtitle}</p>}
      {actionLabel && (
        <motion.button
          whileHover={{ y: -1 }}
          whileTap={{ scale: 0.98 }}
          onClick={onAction}
          className="mt-5 rounded-xl bg-accent px-5 py-2.5 text-body font-medium text-white shadow-glow min-h-[44px]"
        >
          {actionLabel}
        </motion.button>
      )}
    </motion.div>
  );
}
