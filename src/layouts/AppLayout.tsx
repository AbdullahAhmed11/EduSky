import { NavLink, Outlet } from 'react-router-dom';
import {
  BookOpen,
  LayoutDashboard,
  LogOut,
  ShoppingBag,
  TrendingUp,
} from 'lucide-react';
import { motion } from 'framer-motion';
import Logo from '../components/Logo';
import LanguageSwitcher from '../components/LanguageSwitcher';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../i18n/LanguageContext';

const studentLinks = [
  { to: '/dashboard', icon: LayoutDashboard, labelKey: 'dashboard' as const },
  { to: '/exams', icon: BookOpen, labelKey: 'exams' as const },
  { to: '/purchases', icon: ShoppingBag, labelKey: 'purchases' as const },
  { to: '/progress', icon: TrendingUp, labelKey: 'progress' as const },
];

const parentLinks = [
  { to: '/parent/dashboard', icon: LayoutDashboard, labelKey: 'dashboard' as const },
];

export default function AppLayout() {
  const { user, logout } = useAuth();
  const { t } = useLanguage();
  const links = user?.role === 'parent' ? parentLinks : studentLinks;

  const navLabels: Record<string, string> = {
    dashboard: t.nav.dashboard,
    exams: t.nav.exams,
    purchases: t.nav.purchases,
    progress: t.nav.progress,
  };

  return (
    <div className="flex min-h-svh flex-col bg-linear-to-br from-[#f0f7ff]/40 via-white to-[#e8faf5]/40">
      <header className="sticky top-0 z-40 border-b border-white/40 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 lg:px-8">
          <Logo />
          <nav className="hidden items-center gap-1 md:flex">
            {links.map(({ to, icon: Icon, labelKey }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-primary-blue/10 text-primary-blue'
                      : 'text-deep-navy/70 hover:text-primary-blue'
                  }`
                }
              >
                <Icon className="h-4 w-4" />
                {navLabels[labelKey]}
              </NavLink>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            <motion.button
              type="button"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={logout}
              className="flex items-center gap-2 rounded-lg border border-primary-blue/20 px-3 py-2 text-sm font-medium text-deep-navy/70 hover:bg-primary-blue/5"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">{t.auth.logout}</span>
            </motion.button>
          </div>
        </div>
        <nav className="flex items-center gap-2 overflow-x-auto border-t border-white/40 px-4 py-2 md:hidden">
          <LanguageSwitcher className="shrink-0" />
          {links.map(({ to, icon: Icon, labelKey }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium ${
                  isActive ? 'bg-primary-blue/10 text-primary-blue' : 'text-deep-navy/70'
                }`
              }
            >
              <Icon className="h-3.5 w-3.5" />
              {navLabels[labelKey]}
            </NavLink>
          ))}
        </nav>
      </header>
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
}
