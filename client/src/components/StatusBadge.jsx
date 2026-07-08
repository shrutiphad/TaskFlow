const LABEL = { todo: 'To Do', in_progress: 'In Progress', done: 'Done' };
const STYLE = {
  todo: 'text-slate dark:text-slate-dark bg-slate-soft dark:bg-slate/10 ring-1 ring-inset ring-slate/15',
  in_progress: 'text-accent dark:text-accent-dark bg-accent-soft dark:bg-accent/12 ring-1 ring-inset ring-accent/20',
  done: 'text-emerald dark:text-emerald-dark bg-emerald-soft dark:bg-emerald/12 ring-1 ring-inset ring-emerald/20',
};

export default function StatusBadge({ status }) {
  return (
    <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-micro font-semibold ${STYLE[status]}`}>
      {LABEL[status] || status}
    </span>
  );
}
