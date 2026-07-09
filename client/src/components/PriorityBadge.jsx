import { ArrowDown, Minus, Flame } from 'lucide-react';

const CONFIG = {
  low: { label: 'Low', icon: ArrowDown, tone: 'text-emerald dark:text-emerald-dark', bg: 'bg-emerald/12 ring-emerald/25' },
  medium: { label: 'Medium', icon: Minus, tone: 'text-amber dark:text-amber-dark', bg: 'bg-amber/12 ring-amber/25' },
  high: { label: 'High', icon: Flame, tone: 'text-rose dark:text-rose-dark', bg: 'bg-rose/12 ring-rose/25' },
};

export default function PriorityBadge({ priority }) {
  const cfg = CONFIG[priority] || CONFIG.medium;
  const Icon = cfg.icon;
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-micro font-medium font-mono uppercase ring-1 ring-inset ${cfg.tone} ${cfg.bg}`}>
      <Icon size={11} strokeWidth={2.5} />
      {cfg.label}
    </span>
  );
}
