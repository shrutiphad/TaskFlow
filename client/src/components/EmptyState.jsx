import { motion } from 'framer-motion';

export default function EmptyState({ title, subtitle, actionLabel, onAction }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass relative flex flex-col items-center overflow-hidden rounded-3xl px-6 py-16 text-center shadow-glass dark:shadow-glass-dark"
    >
      {/* soft glow behind the illustration */}
      <div className="pointer-events-none absolute left-1/2 top-8 h-40 w-40 -translate-x-1/2 rounded-full bg-accent/20 blur-3xl" />
      <motion.svg
        className="relative mb-5 animate-float drop-shadow-[0_8px_20px_rgba(44,64,192,0.35)]"
        width="88" height="88" viewBox="0 0 88 88" fill="none" xmlns="http://www.w3.org/2000/svg"
      >
        <rect x="18" y="14" width="52" height="64" rx="10" className="fill-white/60 dark:fill-white/10 stroke-white/70 dark:stroke-white/15" strokeWidth="1.5" />
        <rect x="28" y="28" width="32" height="4" rx="2" className="fill-accent/60" />
        <rect x="28" y="38" width="24" height="4" rx="2" className="fill-ink/15 dark:fill-white/20" />
        <rect x="28" y="48" width="28" height="4" rx="2" className="fill-ink/15 dark:fill-white/20" />
        <circle cx="62" cy="62" r="15" className="fill-emerald/20 stroke-emerald" strokeWidth="1.5" />
        <path d="M56 62l4 4 8-8" className="stroke-emerald" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      </motion.svg>
      <h3 className="relative font-display text-h4 font-semibold">{title}</h3>
      {subtitle && <p className="relative mt-1.5 max-w-xs text-body text-ink/55 dark:text-ink-dark/55">{subtitle}</p>}
      {actionLabel && (
        <motion.button
          whileHover={{ y: -1 }}
          whileTap={{ scale: 0.98 }}
          onClick={onAction}
          className="relative mt-5 rounded-xl bg-accent-gradient px-5 py-2.5 text-body font-semibold text-white shadow-glow min-h-[44px]"
        >
          {actionLabel}
        </motion.button>
      )}
    </motion.div>
  );
}
