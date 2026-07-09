import { motion } from 'framer-motion';
import ProgressRing from './ProgressRing';
import AnimatedNumber from './AnimatedNumber';

export default function DashboardStats({ summary }) {
  if (!summary) return null;

  const { total, byStatus, overdue } = summary;
  const doneShare = total > 0 ? byStatus.done / total : 0;

  const cells = [
    { label: 'To Do', value: byStatus.todo, ring: 'text-slate', tone: 'text-slate dark:text-slate-dark' },
    { label: 'In Progress', value: byStatus.in_progress, ring: 'text-accent', tone: 'text-accent dark:text-accent-dark' },
    { label: 'Done', value: byStatus.done, ring: 'text-emerald', tone: 'text-emerald dark:text-emerald-dark' },
    { label: 'Overdue', value: overdue, ring: 'text-rose', tone: 'text-rose dark:text-rose-dark' },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="glass col-span-2 sm:col-span-1 flex items-center gap-4 rounded-2xl p-4 shadow-glass dark:shadow-glass-dark"
      >
        <div className="relative shrink-0">
          <ProgressRing value={byStatus.done} max={total || 1} colorClass="text-accent" />
          <div className="absolute inset-0 flex items-center justify-center font-display text-sm font-semibold tabular">
            {Math.round(doneShare * 100)}%
          </div>
        </div>
        <div>
          <div className="font-mono text-micro font-medium uppercase text-ink/45 dark:text-ink-dark/45">Total tasks</div>
          <div className="font-display text-h2 font-semibold tabular"><AnimatedNumber value={total} /></div>
        </div>
      </motion.div>

      {cells.map((cell, i) => (
        <motion.div
          key={cell.label}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.08 + i * 0.06, ease: [0.16, 1, 0.3, 1] }}
          whileHover={{ y: -3 }}
          className="glass rounded-2xl p-4 shadow-glass dark:shadow-glass-dark hover:shadow-glass-lg dark:hover:shadow-glass-lg-dark transition-shadow duration-300"
        >
          <div className="flex items-center justify-between">
            <div className="font-mono text-micro font-medium uppercase text-ink/45 dark:text-ink-dark/45">{cell.label}</div>
            <ProgressRing value={cell.value} max={total || 1} size={22} stroke={3} colorClass={cell.ring} />
          </div>
          <div className={`mt-2 font-display text-h2 font-semibold tabular ${cell.tone}`}>
            <AnimatedNumber value={cell.value} />
          </div>
        </motion.div>
      ))}
    </div>
  );
}
