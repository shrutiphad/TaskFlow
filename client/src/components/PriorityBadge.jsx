import { ArrowDown, Minus, Flame } from 'lucide-react';

const CONFIG = {
  low: { label: 'Low', icon: ArrowDown, tone: 'text-emerald dark:text-emerald-dark', bg: 'bg-emerald-soft dark:bg-emerald/10' },
  medium: { label: 'Medium', icon: Minus, tone: 'text-amber dark:text-amber-dark', bg: 'bg-amber-soft dark:bg-amber/10' },
  high: { label: 'High', icon: Flame, tone: 'text-rose dark:text-rose-dark', bg: 'bg-rose-soft dark:bg-rose/10' },
};

export default function PriorityBadge({ priority }) {
  const cfg = CONFIG[priority] || CONFIG.medium;
  const Icon = cfg.icon;
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-micro font-medium font-mono uppercase ${cfg.tone} ${cfg.bg}`}>
      <Icon size={11} strokeWidth={2.5} />
      {cfg.label}
    </span>
  );
}
