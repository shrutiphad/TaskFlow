import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center gap-3 bg-canvas dark:bg-canvas-dark font-mono text-sm text-ink/50 dark:text-ink-dark/50">
        <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-accent/30 border-t-accent" />
        Checking session…
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;
  return children;
}
