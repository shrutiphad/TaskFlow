import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const fieldClass =
  'w-full rounded-xl border border-line bg-surface2 px-3.5 py-2.5 text-body outline-none transition-colors dark:border-line-dark dark:bg-surface2-dark focus:border-accent';
const labelClass = 'mb-1.5 block text-micro font-medium uppercase tracking-wide text-ink/50 dark:text-ink-dark/50';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState('');
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();

  const onSubmit = async (values) => {
    setServerError('');
    try {
      await login(values.email, values.password);
      navigate('/dashboard');
    } catch (err) {
      setServerError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-canvas px-4 dark:bg-canvas-dark">
      <div className="pointer-events-none absolute -left-32 -top-32 h-80 w-80 rounded-full bg-accent/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-32 h-80 w-80 rounded-full bg-amber/10 blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 16, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-sm rounded-2xl border border-line dark:border-line-dark bg-surface/90 dark:bg-surface-dark/90 backdrop-blur-xl p-8 shadow-card dark:shadow-card-dark"
      >
        <div className="mb-6 flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent font-display text-sm font-semibold text-white shadow-glow">T</span>
          <span className="font-display text-h4 font-medium tracking-tight">TaskFlow</span>
        </div>
        <h1 className="font-display text-h2 font-medium tracking-tight">Welcome back</h1>
        <p className="mt-1.5 text-body text-ink/55 dark:text-ink-dark/55">Log in to manage your tasks.</p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-3.5">
          <div>
            <label className={labelClass}>Email</label>
            <input type="email" {...register('email', { required: 'Email is required' })} className={fieldClass} placeholder="you@example.com" />
            {errors.email && <p className="mt-1 text-micro text-rose">{errors.email.message}</p>}
          </div>

          <div>
            <label className={labelClass}>Password</label>
            <input type="password" {...register('password', { required: 'Password is required' })} className={fieldClass} placeholder="••••••••" />
            {errors.password && <p className="mt-1 text-micro text-rose">{errors.password.message}</p>}
          </div>

          {serverError && <p className="text-micro text-rose">{serverError}</p>}

          <motion.button
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-lg bg-accent py-3 text-body font-medium text-white shadow-glow disabled:opacity-50 transition-opacity min-h-[44px]"
          >
            {isSubmitting ? 'Logging in…' : 'Log in'}
          </motion.button>
        </form>

        <p className="mt-5 text-center text-body text-ink/55 dark:text-ink-dark/55">
          Don't have an account? <Link to="/register" className="font-medium text-accent dark:text-accent-dark hover:underline">Register</Link>
        </p>

        <p className="mt-5 rounded-xl bg-canvas p-3 text-center text-micro text-ink/45 dark:bg-canvas-dark dark:text-ink-dark/45 font-mono">
          Demo: demo@mayfair.dev / Demo1234
        </p>
      </motion.div>
    </div>
  );
}
