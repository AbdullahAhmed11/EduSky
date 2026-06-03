import { motion } from 'framer-motion';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerParent } from '../../api/auth';
import { ApiError } from '../../api/client';
import { Button } from '../../components/ui';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../i18n/LanguageContext';

export default function RegisterParentPage() {
  const { t } = useLanguage();
  const { setSession } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', phone: '', studentCode: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [successCode, setSuccessCode] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { parent, token } = await registerParent(form);
      setSession('parent', token, undefined, parent);
      setSuccessCode(parent.parentCode);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : t.auth.errorGeneric);
    } finally {
      setLoading(false);
    }
  };

  if (successCode) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
        <div className="mb-4 text-5xl">🎉</div>
        <h2 className="mb-2 text-2xl font-bold text-deep-navy">{t.auth.successTitle}</h2>
        <p className="mb-4 text-deep-navy/70">
          {t.auth.yourCode}: <strong className="text-primary-blue">{successCode}</strong>
        </p>
        <Button onClick={() => navigate('/parent/dashboard')}>{t.auth.goToLogin}</Button>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <h2 className="mb-6 text-2xl font-bold text-deep-navy">{t.auth.registerParentTitle}</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {(['name', 'phone', 'studentCode', 'password'] as const).map((key) => (
          <div key={key}>
            <label className="mb-1.5 block text-sm font-medium text-deep-navy">
              {key === 'name' ? t.auth.name : key === 'phone' ? t.auth.phone : key === 'studentCode' ? t.auth.studentCodeRef : t.auth.password}
            </label>
            <input
              type={key === 'password' ? 'password' : 'text'}
              value={form[key]}
              onChange={(e) => setForm({ ...form, [key]: e.target.value })}
              required
              minLength={key === 'password' ? 6 : undefined}
              className="w-full rounded-xl border border-primary-blue/20 bg-white px-4 py-3 text-deep-navy focus:border-primary-blue focus:outline-none focus:ring-2 focus:ring-primary-blue/20"
            />
          </div>
        ))}
        {error && <p className="text-sm text-red-500">{error}</p>}
        <Button type="submit" disabled={loading} className="w-full">{loading ? '...' : t.auth.registerButton}</Button>
      </form>
      <p className="mt-6 text-center text-sm text-deep-navy/60">
        {t.auth.haveAccount}{' '}
        <Link to="/login" className="font-semibold text-primary-blue hover:underline">{t.auth.goLogin}</Link>
      </p>
    </motion.div>
  );
}
