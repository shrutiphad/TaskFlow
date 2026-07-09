const LABEL = { todo: 'To Do', in_progress: 'In Progress', done: 'Done' };
const STYLE = {
  todo: {
    wrap: 'text-slate dark:text-slate-dark bg-slate/10 ring-slate/20',
    dot: 'bg-slate shadow-[0_0_8px_theme(colors.slate.DEFAULT)]',
  },
  in_progress: {
    wrap: 'text-accent dark:text-accent-dark bg-accent/12 ring-accent/25',
    dot: 'bg-accent shadow-[0_0_8px_theme(colors.accent.DEFAULT)]',
  },
  done: {
    wrap: 'text-emerald dark:text-emerald-dark bg-emerald/12 ring-emerald/25',
    dot: 'bg-emerald shadow-[0_0_8px_theme(colors.emerald.DEFAULT)]',
  },
};

export default function StatusBadge({ status }) {
  const s = STYLE[status] || STYLE.todo;
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-micro font-semibold ring-1 ring-inset ${s.wrap}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
      {LABEL[status] || status}
    </span>
  );
}
