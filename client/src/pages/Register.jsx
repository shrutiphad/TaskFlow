import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const fieldClass =
  'glass-input w-full rounded-xl px-3.5 py-2.5 text-body outline-none transition-colors focus:border-accent';
const labelClass = 'mb-1.5 block text-micro font-medium uppercase tracking-wide text-ink/50 dark:text-ink-dark/50';

export default function Register() {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState('');
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm();

  const password = watch('password');

  const onSubmit = async (values) => {
    setServerError('');
    try {
      await registerUser(values.name, values.email, values.password);
      navigate('/dashboard');
    } catch (err) {
      setServerError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4">
      <motion.div
        initial={{ opacity: 0, y: 16, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
       className="glass-strong relative w-full max-w-sm rounded-3xl p-6 sm:p-8 shadow-glass-lg dark:shadow-glass-lg-dark"
     >
     <div className="mb-6 flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent-gradient font-display text-sm font-bold text-white shadow-glow">T</span>
          <span className="font-display text-h4 font-semibold tracking-tight">TaskFlow</span>
        </div>
        <h1 className="font-display text-h2 font-semibold tracking-tight">Create your account</h1>
        <p className="mt-1.5 text-body text-ink/55 dark:text-ink-dark/55">Start managing your tasks in seconds.</p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-3.5">
          <div>
            <label className={labelClass}>Name</label>
            <input
              {...register('name', { required: 'Name is required', minLength: { value: 2, message: 'Name is too short' } })}
              className={fieldClass}
              placeholder="Jane Doe"
            />
            {errors.name && <p className="mt-1 text-micro text-rose">{errors.name.message}</p>}
          </div>

          <div>
            <label className={labelClass}>Email</label>
            <input
              type="email"
              {...register('email', {
                required: 'Email is required',
                pattern: { value: /^\S+@\S+\.\S+$/, message: 'Enter a valid email' },
              })}
              className={fieldClass}
              placeholder="you@example.com"
            />
            {errors.email && <p className="mt-1 text-micro text-rose">{errors.email.message}</p>}
          </div>

          <div>
            <label className={labelClass}>Password</label>
            <input
              type="password"
              {...register('password', {
                required: 'Password is required',
                minLength: { value: 8, message: 'At least 8 characters' },
                pattern: { value: /\d/, message: 'Must include at least one number' },
              })}
              className={fieldClass}
              placeholder="At least 8 characters, 1 number"
            />
            {errors.password && <p className="mt-1 text-micro text-rose">{errors.password.message}</p>}
          </div>

          <div>
            <label className={labelClass}>Confirm password</label>
            <input
              type="password"
              {...register('confirmPassword', {
                required: 'Please confirm your password',
                validate: (value) => value === password || 'Passwords do not match',
              })}
              className={fieldClass}
              placeholder="Re-enter password"
            />
            {errors.confirmPassword && <p className="mt-1 text-micro text-rose">{errors.confirmPassword.message}</p>}
          </div>

          {serverError && <p className="text-micro text-rose">{serverError}</p>}

          <motion.button
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-xl bg-accent-gradient py-3 text-body font-semibold text-white shadow-glow disabled:opacity-50 transition-opacity min-h-[44px]"
          >
            {isSubmitting ? 'Creating account…' : 'Create account'}
          </motion.button>
        </form>

        <p className="mt-5 text-center text-body text-ink/55 dark:text-ink-dark/55">
          Already have an account? <Link to="/login" className="font-semibold text-accent dark:text-accent-dark hover:underline">Log in</Link>
        </p>
      </motion.div>
    </div>
  );
}
