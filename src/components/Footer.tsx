import { motion, useInView, type Variants } from 'framer-motion';
import {
  BookOpen,
  GraduationCap,
  Heart,
  Mail,
  MapPin,
  Phone,
  Send,
  Sparkles,
} from 'lucide-react';
import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';
import Logo from './Logo';

const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07, delayChildren: 0.1 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' } },
};

function FooterLink({ href, label }: { href: string; label: string }) {
  return (
    <motion.li variants={item}>
      <a
        href={href}
        className="group inline-flex items-center gap-1 text-sm text-white/70 transition-colors hover:text-sky-cyan"
      >
        <span className="h-px w-0 bg-sky-cyan transition-all group-hover:w-3" />
        {label}
      </a>
    </motion.li>
  );
}

export default function Footer() {
  const { t, dir } = useLanguage();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });

  const platformLinks = [
    { href: '#subjects', label: t.nav.subjects },
    { href: '#teachers', label: t.nav.teachers },
    { href: '#exams', label: t.nav.exams },
    { href: '#lectures', label: t.nav.lectures },
  ];

  const companyLinks = [
    { href: '#about', label: t.footer.about },
    { href: '#careers', label: t.footer.careers },
    { href: '#privacy', label: t.footer.privacy },
    { href: '#terms', label: t.footer.terms },
  ];

  return (
    <footer ref={ref} className="relative overflow-hidden bg-deep-navy text-white">
      {/* Top CTA band */}
      <div className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-linear-to-r from-primary-blue/20 via-sky-cyan/15 to-emerald-green/20" />
        <motion.div
          aria-hidden
          className="pointer-events-none absolute -top-24 start-1/4 h-48 w-48 rounded-full bg-primary-blue/20 blur-3xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          aria-hidden
          className="pointer-events-none absolute -bottom-16 end-1/4 h-40 w-40 rounded-full bg-emerald-green/15 blur-3xl"
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        />

        <div className="relative mx-auto flex max-w-7xl flex-col items-center gap-6 px-6 py-12 text-center lg:flex-row lg:justify-between lg:px-8 lg:text-start">
          <motion.div
            initial={{ opacity: 0, x: dir === 'rtl' ? 24 : -24 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <p className="mb-1 flex items-center justify-center gap-2 text-sm font-medium text-sky-cyan lg:justify-start">
              <Sparkles className="h-4 w-4" />
              {t.footer.ctaBadge}
            </p>
            <h2 className="text-2xl font-bold sm:text-3xl">{t.footer.ctaTitle}</h2>
          </motion.div>

          <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
            <Link
              to="/register/student"
              className="inline-flex items-center gap-2 rounded-xl bg-bright-orange px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-bright-orange/30"
            >
              <GraduationCap className="h-5 w-5" />
              {t.footer.ctaButton}
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Main footer */}
      <div className="relative mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <motion.div
          variants={stagger}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4"
        >
          {/* Brand */}
          <motion.div variants={item} className="sm:col-span-2 lg:col-span-1">
            <Logo size="lg" theme="dark" className="mb-4" />
            <p className="mb-2 text-sm font-semibold text-sky-cyan">{t.footer.companyName}</p>
            <p className="mb-6 max-w-xs text-sm leading-relaxed text-white/60">{t.footer.description}</p>

            <div className="flex gap-3">
              {[Mail, Send, BookOpen].map((Icon, i) => (
                <motion.a
                  key={i}
                  href="#"
                  whileHover={{ y: -4, scale: 1.08 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white/70 transition-colors hover:border-sky-cyan/40 hover:bg-sky-cyan/10 hover:text-sky-cyan"
                  aria-label="Social link"
                >
                  <Icon className="h-4 w-4" />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Platform */}
          <motion.div variants={item}>
            <h3 className="mb-5 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-white">
              <BookOpen className="h-4 w-4 text-emerald-green" />
              {t.footer.platformTitle}
            </h3>
            <motion.ul variants={stagger} className="space-y-3">
              {platformLinks.map((link) => (
                <FooterLink key={link.href} {...link} />
              ))}
            </motion.ul>
          </motion.div>

          {/* Company */}
          <motion.div variants={item}>
            <h3 className="mb-5 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-white">
              <GraduationCap className="h-4 w-4 text-warm-orange" />
              {t.footer.companyTitle}
            </h3>
            <motion.ul variants={stagger} className="space-y-3">
              {companyLinks.map((link) => (
                <FooterLink key={link.href} {...link} />
              ))}
            </motion.ul>
          </motion.div>

          {/* Contact */}
          <motion.div variants={item}>
            <h3 className="mb-5 text-sm font-semibold uppercase tracking-wider text-white">
              {t.footer.contactTitle}
            </h3>
            <ul className="space-y-4">
              {[
                { icon: Mail, text: t.footer.contact.email },
                { icon: Phone, text: t.footer.contact.phone },
                { icon: MapPin, text: t.footer.contact.address },
              ].map(({ icon: Icon, text }, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: dir === 'rtl' ? 12 : -12 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className="flex items-start gap-3 text-sm text-white/60"
                >
                  <Icon className="mt-0.5 h-4 w-4 shrink-0 text-sky-cyan" />
                  <span>{text}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom bar */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="border-t border-white/10"
      >
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-6 text-center sm:flex-row lg:px-8">
          <p className="text-sm text-white/50">
            © {new Date().getFullYear()} {t.footer.copyright}
          </p>
          <motion.p
            className="flex items-center gap-1.5 text-sm text-white/50"
            whileHover={{ scale: 1.02 }}
          >
            {t.footer.madeWith}{' '}
            <motion.span
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
            >
              <Heart className="h-3.5 w-3.5 fill-bright-orange text-bright-orange" />
            </motion.span>{' '}
            {t.footer.byTeam}
          </motion.p>
        </div>
      </motion.div>

      {/* Decorative bottom gradient line */}
      <motion.div
        aria-hidden
        className="h-1 bg-linear-to-r from-emerald-green via-sky-cyan to-primary-blue"
        initial={{ scaleX: 0 }}
        animate={isInView ? { scaleX: 1 } : {}}
        transition={{ duration: 1, delay: 0.3, ease: 'easeOut' }}
        style={{ transformOrigin: dir === 'rtl' ? 'right' : 'left' }}
      />
    </footer>
  );
}
