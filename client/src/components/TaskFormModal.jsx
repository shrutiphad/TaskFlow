import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

const taskSchema = z.object({
  title: z.string().trim().min(1, 'Title is required').max(200),
  description: z.string().max(2000).optional().or(z.literal('')),
  priority: z.enum(['low', 'medium', 'high']),
  status: z.enum(['todo', 'in_progress', 'done']),
  due_date: z.string().optional().or(z.literal('')),
});

const fieldClass =
  'glass-input w-full rounded-xl px-3.5 py-2.5 text-body outline-none transition-colors focus:border-accent';
const labelClass = 'mb-1.5 block text-micro font-medium uppercase tracking-wide text-ink/50 dark:text-ink-dark/50';

export default function TaskFormModal({ open, initialTask, onClose, onSubmit }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(taskSchema),
    defaultValues: { title: '', description: '', priority: 'medium', status: 'todo', due_date: '' },
  });

  useEffect(() => {
    if (open) {
      reset(
        initialTask
          ? {
              title: initialTask.title,
              description: initialTask.description || '',
              priority: initialTask.priority,
              status: initialTask.status,
              due_date: initialTask.due_date || '',
            }
          : { title: '', description: '', priority: 'medium', status: 'todo', due_date: '' }
      );
    }
  }, [open, initialTask, reset]);

  const submit = async (values) => {
    await onSubmit({ ...values, due_date: values.due_date || null });
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 dark:bg-black/60 backdrop-blur-sm p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 4 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="glass-strong w-full max-w-md max-h-[90vh] overflow-y-auto rounded-3xl p-6 shadow-glass-lg dark:shadow-glass-lg-dark"
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-h4 font-semibold">{initialTask ? 'Edit task' : 'New task'}</h2>
              <button onClick={onClose} aria-label="Close" className="rounded-lg p-1.5 hover:bg-white/40 dark:hover:bg-white/5 transition-colors">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit(submit)} className="space-y-3">
              <div>
                <label htmlFor="task-title" className={labelClass}>Title</label>
                <input {...register('title')} id="task-title" className={fieldClass} placeholder="e.g. Ship the onboarding flow" />
                {errors.title && <p className="mt-1 text-micro text-rose">{errors.title.message}</p>}
              </div>

              <div>
                <label htmlFor="task-description" className={labelClass}>Description</label>
                <textarea {...register('description')} id="task-description" rows={3} className={fieldClass} placeholder="Optional details" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="task-priority" className={labelClass}>Priority</label>
                  <select {...register('priority')} id="task-priority" className={fieldClass}>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="task-status" className={labelClass}>Status</label>
                  <select {...register('status')} id="task-status" className={fieldClass}>
                    <option value="todo">To Do</option>
                    <option value="in_progress">In Progress</option>
                    <option value="done">Done</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="task-due_date" className={labelClass}>Due date</label>
                <input type="date" {...register('due_date')} id="task-due_date" className={fieldClass} />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={onClose} className="rounded-xl px-4 py-2.5 text-body font-medium hover:bg-white/40 dark:hover:bg-white/5 transition-colors min-h-[44px]">
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-xl bg-accent-gradient px-4 py-2.5 text-body font-semibold text-white shadow-glow disabled:opacity-50 transition-opacity min-h-[44px]"
                >
                  {initialTask ? 'Save changes' : 'Create task'}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
