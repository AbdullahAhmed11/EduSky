import { motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../i18n/LanguageContext';
import LanguageSwitcher from './LanguageSwitcher';
import Logo from './Logo';

export default function Navbar() {
  const { t, dir } = useLanguage();
  const { isAuthenticated, user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { href: '#subjects', label: t.nav.subjects },
    { href: '#teachers', label: t.nav.teachers },
    { href: '#exams', label: t.nav.exams },
    { href: '#lectures', label: t.nav.lectures },
    { href: '#progress', label: t.nav.progress },
  ];

  const dashboardPath = user?.role === 'parent' ? '/parent/dashboard' : '/dashboard';

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="fixed inset-x-0 top-0 z-50 border-b border-white/40 bg-white/75 backdrop-blur-md"
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
        <Logo />

        <ul className="hidden items-center gap-8 md:flex">
          {navLinks.map(({ href, label }) => (
            <li key={href}>
              <a href={href} className="text-sm font-medium text-deep-navy/80 transition-colors hover:text-primary-blue">
                {label}
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-4 md:flex">
          <LanguageSwitcher />

          {isAuthenticated ? (
            <>
              <Link to={dashboardPath} className="text-sm font-medium text-deep-navy/80 hover:text-primary-blue">
                {t.nav.dashboard}
              </Link>
              <motion.button
                type="button"
                onClick={logout}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="rounded-lg border border-primary-blue/20 px-5 py-2.5 text-sm font-medium text-deep-navy"
              >
                {t.nav.logout}
              </motion.button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm font-medium text-deep-navy/80 hover:text-primary-blue">
                {t.nav.login}
              </Link>
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Link
                  to="/register/student"
                  className="rounded-lg bg-bright-orange px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-bright-orange/25"
                >
                  {t.nav.getStarted}
                </Link>
              </motion.div>
            </>
          )}
        </div>

        <button
          type="button"
          onClick={() => setMobileOpen((o) => !o)}
          className="rounded-lg p-2 text-deep-navy md:hidden"
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="border-t border-white/40 bg-white/90 backdrop-blur-md md:hidden"
        >
          <div className="flex flex-col gap-4 px-6 py-4">
            {navLinks.map(({ href, label }) => (
              <a key={href} href={href} onClick={() => setMobileOpen(false)} className="text-sm font-medium text-deep-navy/80">
                {label}
              </a>
            ))}

            <LanguageSwitcher className="w-full [&_select]:w-full" />

            <div className={`flex gap-3 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
              {isAuthenticated ? (
                <>
                  <Link to={dashboardPath} className="flex-1 rounded-lg border border-primary-blue/20 py-2.5 text-center text-sm font-medium text-deep-navy">
                    {t.nav.dashboard}
                  </Link>
                  <button type="button" onClick={logout} className="flex-1 rounded-lg bg-bright-orange py-2.5 text-center text-sm font-semibold text-white">
                    {t.nav.logout}
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="flex-1 rounded-lg border border-primary-blue/20 py-2.5 text-center text-sm font-medium text-deep-navy">
                    {t.nav.login}
                  </Link>
                  <Link to="/register/student" className="flex-1 rounded-lg bg-bright-orange py-2.5 text-center text-sm font-semibold text-white">
                    {t.nav.getStarted}
                  </Link>
                </>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </motion.header>
  );
}
