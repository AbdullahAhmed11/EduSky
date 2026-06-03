import { motion } from 'framer-motion';
import { useState } from 'react';
import { Link, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { ApiError } from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../i18n/LanguageContext';
import { Button } from '../../components/ui';

type Tab = 'student' | 'parent';

export default function LoginPage() {
  const { t } = useLanguage();
  const { loginStudent, loginParent, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname;

  const [tab, setTab] = useState<Tab>('student');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) {
    return <Navigate to={user?.role === 'parent' ? '/parent/dashboard' : '/dashboard'} replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (tab === 'student') {
        await loginStudent(code, password);
        navigate(from ?? '/dashboard', { replace: true });
      } else {
        await loginParent(code, password);
        navigate(from ?? '/parent/dashboard', { replace: true });
      }
    } catch (err) {
      setError(err instanceof ApiError ? err.message : t.auth.errorGeneric);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <h2 className="mb-6 text-2xl font-bold text-deep-navy">{t.auth.loginTitle}</h2>

      <div className="mb-6 flex rounded-xl bg-white/80 p-1 shadow-sm">
        {(['student', 'parent'] as Tab[]).map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => setTab(key)}
            className={`flex-1 rounded-lg py-2.5 text-sm font-semibold transition-colors ${
              tab === key ? 'bg-primary-blue text-white' : 'text-deep-navy/60'
            }`}
          >
            {key === 'student' ? t.auth.studentTab : t.auth.parentTab}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-deep-navy">
            {tab === 'student' ? t.auth.studentCode : t.auth.parentCode}
          </label>
          <input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
            className="w-full rounded-xl border border-primary-blue/20 bg-white px-4 py-3 text-deep-navy focus:border-primary-blue focus:outline-none focus:ring-2 focus:ring-primary-blue/20"
            placeholder={tab === 'student' ? 'ST1234' : 'PR1234'}
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-deep-navy">{t.auth.password}</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            className="w-full rounded-xl border border-primary-blue/20 bg-white px-4 py-3 text-deep-navy focus:border-primary-blue focus:outline-none focus:ring-2 focus:ring-primary-blue/20"
          />
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? '...' : t.auth.loginButton}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-deep-navy/60">
        {t.auth.noAccount}{' '}
        <Link to="/register/student" className="font-semibold text-primary-blue hover:underline">
          {t.auth.registerStudent}
        </Link>
        {' · '}
        <Link to="/register/parent" className="font-semibold text-primary-blue hover:underline">
          {t.auth.registerParent}
        </Link>
      </p>
    </motion.div>
  );
}
