import { Link } from 'react-router-dom';
import { motion, type Variants } from 'framer-motion';
import {
  BookOpen,
  ClipboardCheck,
  GraduationCap,
  PlayCircle,
  Send,
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay, ease: 'easeOut' },
  }),
};

export default function HeroSection() {
  const { t, dir } = useLanguage();

  const features = [
    { icon: ClipboardCheck, label: t.hero.features.exams, color: 'text-primary-blue' },
    { icon: PlayCircle, label: t.hero.features.lectures, color: 'text-sky-cyan' },
    { icon: TrendingUp, label: t.hero.features.progress, color: 'text-emerald-green' },
  ];

  const textAlign = dir === 'rtl' ? 'lg:text-right' : 'lg:text-left';
  const justifyStart = dir === 'rtl' ? 'lg:justify-end' : 'lg:justify-start';
  const slideFrom = dir === 'rtl' ? 16 : -16;

  return (
    <section className="relative min-h-svh overflow-hidden bg-linear-to-br from-[#f0f7ff] via-white to-[#e8faf5] pt-20">
      {/* Ambient glow orbs */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -top-32 -start-32 h-96 w-96 rounded-full bg-primary-blue/10 blur-3xl"
        animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.6, 0.4] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute top-1/3 -end-24 h-80 w-80 rounded-full bg-sky-cyan/15 blur-3xl"
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute bottom-0 start-1/4 h-64 w-64 rounded-full bg-emerald-green/10 blur-3xl"
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
      />

      {/* Floating paper planes */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute top-24 end-[18%] text-bright-orange"
        animate={{ y: [0, -18, 0], rotate: [0, 8, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      >
        <Send className="h-7 w-7 -rotate-45 opacity-70" />
      </motion.div>
      <motion.div
        aria-hidden
        className="pointer-events-none absolute top-40 start-[12%] text-sky-cyan"
        animate={{ y: [0, -14, 0], rotate: [0, -6, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
      >
        <Send className="h-5 w-5 -rotate-45 opacity-60" />
      </motion.div>
      <motion.div
        aria-hidden
        className="pointer-events-none absolute bottom-32 end-[8%] text-sky-cyan"
        animate={{ y: [0, -12, 0], rotate: [0, 5, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      >
        <Send className="h-4 w-4 -rotate-45 opacity-50" />
      </motion.div>

      <div className={`relative mx-auto flex max-w-7xl flex-col items-center gap-12 px-6 py-16 lg:items-center lg:gap-16 lg:px-8 lg:py-24 ${dir === 'rtl' ? 'lg:flex-row-reverse' : 'lg:flex-row'}`}>
        {/* Content */}
        <div className={`flex-1 text-center ${textAlign}`}>
          <motion.div
            custom={0}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary-blue/20 bg-white/70 px-4 py-2 text-sm font-medium text-deep-navy shadow-sm backdrop-blur-sm"
          >
            <Sparkles className="h-4 w-4 text-warm-orange" />
            <span>{t.hero.tagline}</span>
          </motion.div>

          <motion.h1
            custom={0.1}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="mb-6 text-4xl font-bold leading-tight tracking-tight text-deep-navy sm:text-5xl lg:text-6xl"
          >
            {t.hero.titleBefore}{' '}
            <span className="bg-linear-to-r from-emerald-green via-sky-cyan to-primary-blue bg-clip-text text-transparent">
              {t.hero.titleHighlight}
            </span>{' '}
            {t.hero.titleAfter}
          </motion.h1>

          <motion.p
            custom={0.2}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className={`mx-auto mb-8 max-w-xl text-lg leading-relaxed text-deep-navy/70 ${dir === 'rtl' ? 'lg:ms-0 lg:me-auto' : 'lg:mx-0'}`}
          >
            {t.hero.description}
          </motion.p>

          <motion.div
            custom={0.3}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className={`mb-10 flex flex-col items-center gap-4 sm:flex-row ${justifyStart}`}
          >
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
              <Link
                to="/register/student"
                className="group relative inline-flex items-center gap-2 overflow-hidden rounded-xl bg-bright-orange px-8 py-4 text-base font-semibold text-white shadow-lg shadow-bright-orange/30"
              >
                <span className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                <GraduationCap className="h-5 w-5" />
                {t.hero.ctaPrimary}
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Link
                to="/login"
                className="inline-flex items-center gap-2 rounded-xl border-2 border-primary-blue/30 bg-white/80 px-8 py-4 text-base font-semibold text-primary-blue backdrop-blur-sm transition-colors hover:border-primary-blue hover:bg-primary-blue/5"
              >
                <BookOpen className="h-5 w-5" />
                {t.hero.ctaSecondary}
              </Link>
            </motion.div>
          </motion.div>

          <motion.div
            custom={0.4}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className={`flex flex-wrap items-center justify-center gap-6 ${justifyStart}`}
          >
            {features.map(({ icon: Icon, label, color }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, x: slideFrom }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + i * 0.12, duration: 0.5 }}
                className="flex items-center gap-2 rounded-lg bg-white/60 px-4 py-2.5 shadow-sm backdrop-blur-sm"
              >
                <Icon className={`h-5 w-5 ${color}`} />
                <span className="text-sm font-medium text-deep-navy">{label}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Hero image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2, ease: 'easeOut' }}
          className="relative flex-1"
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            className="relative mx-auto max-w-md lg:max-w-lg"
          >
            <motion.div
              aria-hidden
              className="absolute -inset-4 rounded-3xl border border-sky-cyan/20"
              animate={{ rotate: [0, 1, 0, -1, 0] }}
              transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
            />
            <motion.div
              aria-hidden
              className="absolute -inset-8 rounded-[2rem] bg-linear-to-br from-primary-blue/10 via-sky-cyan/10 to-emerald-green/10 blur-xl"
              animate={{ opacity: [0.5, 0.8, 0.5] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            />

            <div className="relative overflow-hidden rounded-2xl shadow-2xl shadow-primary-blue/15 ring-1 ring-white/80">
              <img
                src="/assets/edusky-hero.png"
                alt={t.hero.imageAlt}
                className="h-auto w-full object-cover"
              />
              <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-deep-navy/10 via-transparent to-transparent" />
            </div>

            <motion.div
              initial={{ opacity: 0, x: dir === 'rtl' ? -20 : 20 }}
              animate={{ opacity: 1, x: 0, y: [0, -8, 0] }}
              transition={{
                opacity: { delay: 0.8, duration: 0.5 },
                x: { delay: 0.8, duration: 0.5 },
                y: { duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 0.8 },
              }}
              className="absolute -end-4 top-8 rounded-xl bg-white/95 px-4 py-3 shadow-lg backdrop-blur-sm sm:-end-8"
            >
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-green/15">
                  <ClipboardCheck className="h-5 w-5 text-emerald-green" />
                </div>
                <div>
                  <p className="text-xs text-deep-navy/60">{t.hero.stats.examsPassed}</p>
                  <p className="text-lg font-bold text-deep-navy">98%</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: dir === 'rtl' ? 20 : -20 }}
              animate={{ opacity: 1, x: 0, y: [0, -6, 0] }}
              transition={{
                opacity: { delay: 1, duration: 0.5 },
                x: { delay: 1, duration: 0.5 },
                y: { duration: 5.5, repeat: Infinity, ease: 'easeInOut', delay: 1 },
              }}
              className="absolute -start-4 bottom-16 rounded-xl bg-white/95 px-4 py-3 shadow-lg backdrop-blur-sm sm:-start-8"
            >
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-blue/15">
                  <PlayCircle className="h-5 w-5 text-primary-blue" />
                </div>
                <div>
                  <p className="text-xs text-deep-navy/60">{t.hero.stats.liveLectures}</p>
                  <p className="text-lg font-bold text-deep-navy">500+</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
