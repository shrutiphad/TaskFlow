import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../components/Navbar';
import FilterSortBar from '../components/FilterSortBar';
import TaskCard from '../components/TaskCard';
import TaskFormModal from '../components/TaskFormModal';
import ConfirmDialog from '../components/ConfirmDialog';
import EmptyState from '../components/EmptyState';
import { useTaskStore } from '../store/taskStore';

export default function Tasks() {
  const { tasks, isLoading, error, filters, setFilters, loadTasks, addTask, editTask, removeTask } =
    useTaskStore();

  const [formOpen, setFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [deletingTask, setDeletingTask] = useState(null);
  const [formError, setFormError] = useState('');

  useEffect(() => {
    loadTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openNewTaskForm = () => {
    setEditingTask(null);
    setFormError('');
    setFormOpen(true);
  };

  const openEditForm = (task) => {
    setEditingTask(task);
    setFormError('');
    setFormOpen(true);
  };

  const handleFormSubmit = async (values) => {
    setFormError('');
    try {
      if (editingTask) {
        await editTask(editingTask.id, values);
      } else {
        await addTask(values);
      }
      setFormOpen(false);
    } catch (err) {
      setFormError(err.response?.data?.message || 'Could not save task');
    }
  };

  const confirmDelete = async () => {
    if (!deletingTask) return;
    await removeTask(deletingTask.id);
    setDeletingTask(null);
  };

  const hasActiveFilters = Boolean(filters.status || filters.priority);

  return (
    <div className="flex">
      <Navbar />

         <main className="min-h-screen flex-1 px-5 pt-5 sm:px-8 sm:pt-8 pb-24 md:pb-8 max-w-5xl">
        <motion.header
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="mb-6"
        >
          <h1 className="font-display text-h1 font-medium tracking-tight">Tasks</h1>
          <p className="mt-1 text-body text-ink/55 dark:text-ink-dark/55">
            {tasks.length} task{tasks.length === 1 ? '' : 's'} matching your filters.
          </p>
        </motion.header>

        <FilterSortBar filters={filters} onChange={setFilters} onNewTask={openNewTaskForm} />

        {error && <p className="mb-4 text-body text-rose">{error}</p>}
        {formError && <p className="mb-4 text-body text-rose">{formError}</p>}

        {isLoading ? (
          <div className="space-y-2.5">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-[104px] animate-pulse rounded-2xl border border-line/60 dark:border-line-dark/60 bg-surface2 dark:bg-surface2-dark" />
            ))}
          </div>
        ) : tasks.length === 0 ? (
          <EmptyState
            title={hasActiveFilters ? 'Nothing matches these filters' : "You're all clear"}
            subtitle={
              hasActiveFilters
                ? 'Try widening your filters, or clear them to see everything.'
                : "No tasks yet — add your first one and it'll show up here."
            }
            actionLabel="Create your first task"
            onAction={openNewTaskForm}
          />
        ) : (
          <div className="space-y-2.5">
            <AnimatePresence>
              {tasks.map((task) => (
                <TaskCard key={task.id} task={task} onEdit={openEditForm} onDelete={setDeletingTask} />
              ))}
            </AnimatePresence>
          </div>
        )}
      </main>

      <TaskFormModal open={formOpen} initialTask={editingTask} onClose={() => setFormOpen(false)} onSubmit={handleFormSubmit} />

      <ConfirmDialog
        open={Boolean(deletingTask)}
        title="Delete this task?"
        description={deletingTask ? `"${deletingTask.title}" will be permanently deleted. This can't be undone.` : ''}
        confirmLabel="Delete"
        onConfirm={confirmDelete}
        onCancel={() => setDeletingTask(null)}
      />
    </div>
  );
}
