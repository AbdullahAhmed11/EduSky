import { motion } from 'framer-motion';
import { Outlet } from 'react-router-dom';
import Logo from '../components/Logo';
import { useLanguage } from '../i18n/LanguageContext';

export default function AuthLayout() {
  const { t } = useLanguage();

  return (
    <div className="flex min-h-svh">
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        className="relative hidden w-1/2 overflow-hidden bg-linear-to-br from-primary-blue via-sky-cyan to-emerald-green lg:flex lg:flex-col lg:justify-center lg:px-16"
      >
        <motion.div
          aria-hidden
          className="absolute -top-20 -start-20 h-64 w-64 rounded-full bg-white/10 blur-3xl"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
        <Logo size="lg" theme="dark" className="relative mb-6" />
        <p className="relative max-w-md text-lg text-white/90">{t.auth.brandTagline}</p>
      </motion.div>

      <div className="flex flex-1 items-center justify-center bg-linear-to-br from-[#f0f7ff] via-white to-[#e8faf5] px-6 py-12">
        <div className="w-full max-w-md">
          <div className="mb-8 lg:hidden">
            <Logo size="lg" />
          </div>
          <Outlet />
        </div>
      </div>
    </div>
  );
}
