const LABEL = { low: 'Low', medium: 'Medium', high: 'High' };
const DOT = { low: 'bg-priority-low', medium: 'bg-priority-medium', high: 'bg-priority-high' };

export default function PriorityBadge({ priority }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-line/80 dark:border-line-dark/80 bg-surface2 dark:bg-surface2-dark px-2.5 py-1 text-[11px] font-medium font-mono tracking-wide">
      <span className={`h-1.5 w-1.5 rounded-full ${DOT[priority]} shadow-[0_0_0_3px_rgba(0,0,0,0.03)]`} aria-hidden="true" />
      {LABEL[priority] || priority}
    </span>
  );
}
