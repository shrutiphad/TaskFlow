const LABEL = { todo: 'To Do', in_progress: 'In Progress', done: 'Done' };
const STYLE = {
  todo: 'text-status-todo bg-status-todo/10 ring-1 ring-inset ring-status-todo/20',
  in_progress: 'text-status-progress bg-status-progress/10 ring-1 ring-inset ring-status-progress/20',
  done: 'text-status-done bg-status-done/10 ring-1 ring-inset ring-status-done/20',
};

export default function StatusBadge({ status }) {
  return (
    <span className={`inline-flex items-center rounded-md px-2 py-1 text-[11px] font-semibold tracking-wide ${STYLE[status]}`}>
      {LABEL[status] || status}
    </span>
  );
}
