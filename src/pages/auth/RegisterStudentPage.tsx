import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerStudent } from '../../api/auth';
import { getEducationalStages } from '../../api/students';
import { ApiError } from '../../api/client';
import { Button } from '../../components/ui';
import { useLanguage } from '../../i18n/LanguageContext';
import type { EducationalStage } from '../../types/api';

export default function RegisterStudentPage() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [stages, setStages] = useState<EducationalStage[]>([]);
  const [form, setForm] = useState({
    username: '',
    phoneNumber: '',
    birthday: '',
    educationalStageId: '',
    password: '',
    coupon: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [successCode, setSuccessCode] = useState('');

  useEffect(() => {
    getEducationalStages().then(setStages).catch(() => {});
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { student } = await registerStudent({
        ...form,
        coupon: form.coupon || undefined,
      });
      setSuccessCode(student.studentCode);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : t.auth.errorGeneric);
    } finally {
      setLoading(false);
    }
  };

  if (successCode) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center"
      >
        <div className="mb-4 text-5xl">🎉</div>
        <h2 className="mb-2 text-2xl font-bold text-deep-navy">{t.auth.successTitle}</h2>
        <p className="mb-4 text-deep-navy/70">
          {t.auth.yourCode}: <strong className="text-primary-blue">{successCode}</strong>
        </p>
        <Button onClick={() => navigate('/login')}>{t.auth.goToLogin}</Button>
      </motion.div>
    );
  }

  const field = (key: keyof typeof form, label: string, type = 'text') => (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-deep-navy">{label}</label>
      <input
        type={type}
        value={form[key]}
        onChange={(e) => setForm({ ...form, [key]: e.target.value })}
        required={key !== 'coupon'}
        minLength={key === 'password' ? 6 : undefined}
        className="w-full rounded-xl border border-primary-blue/20 bg-white px-4 py-3 text-deep-navy focus:border-primary-blue focus:outline-none focus:ring-2 focus:ring-primary-blue/20"
      />
    </div>
  );

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <h2 className="mb-6 text-2xl font-bold text-deep-navy">{t.auth.registerStudentTitle}</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {field('username', t.auth.username)}
        {field('phoneNumber', t.auth.phone)}
        {field('birthday', t.auth.birthday, 'date')}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-deep-navy">{t.auth.educationalStage}</label>
          <select
            value={form.educationalStageId}
            onChange={(e) => setForm({ ...form, educationalStageId: e.target.value })}
            required
            className="w-full rounded-xl border border-primary-blue/20 bg-white px-4 py-3 text-deep-navy focus:border-primary-blue focus:outline-none"
          >
            <option value="">—</option>
            {stages.map((s) => (
              <option key={s.id} value={s.id}>{s.nameAr ?? s.name}</option>
            ))}
          </select>
        </div>
        {field('password', t.auth.password, 'password')}
        {field('coupon', t.auth.coupon)}
        {error && <p className="text-sm text-red-500">{error}</p>}
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? '...' : t.auth.registerButton}
        </Button>
      </form>
      <p className="mt-6 text-center text-sm text-deep-navy/60">
        {t.auth.haveAccount}{' '}
        <Link to="/login" className="font-semibold text-primary-blue hover:underline">{t.auth.goLogin}</Link>
      </p>
    </motion.div>
  );
}
