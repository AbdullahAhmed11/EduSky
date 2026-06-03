import { motion, useInView, type Variants } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Clock,
  FileText,
  Languages,
  PlayCircle,
  Sparkles,
  Star,
  Users,
} from 'lucide-react';
import { useRef } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import type { SubjectItem } from '../i18n/locales/en';

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, delay, ease: 'easeOut' },
  }),
};

const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.15 },
  },
};

const statItem: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.45, ease: 'easeOut' },
  },
};

function StatBox({
  icon: Icon,
  value,
  label,
  colorClass,
}: {
  icon: typeof PlayCircle;
  value: string;
  label: string;
  colorClass: string;
}) {
  return (
    <motion.div
      variants={statItem}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="flex flex-col items-center gap-1 rounded-xl bg-white/80 px-4 py-3 shadow-sm backdrop-blur-sm"
    >
      <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${colorClass}`}>
        <Icon className="h-4 w-4" />
      </div>
      <span className="text-xl font-bold text-deep-navy">{value}</span>
      <span className="text-xs text-deep-navy/60">{label}</span>
    </motion.div>
  );
}

function SubjectCard({ subject }: { subject: SubjectItem }) {
  const { t, dir } = useLanguage();
  const Arrow = dir === 'rtl' ? ArrowLeft : ArrowRight;

  const stats = [
    {
      icon: PlayCircle,
      value: subject.lectures,
      label: t.subjects.stats.lectures,
      colorClass: 'bg-primary-blue/15 text-primary-blue',
    },
    {
      icon: FileText,
      value: subject.exams,
      label: t.subjects.stats.exams,
      colorClass: 'bg-emerald-green/15 text-emerald-green',
    },
    {
      icon: Users,
      value: subject.students,
      label: t.subjects.stats.students,
      colorClass: 'bg-sky-cyan/15 text-sky-cyan',
    },
    {
      icon: Clock,
      value: subject.duration,
      label: t.subjects.stats.duration,
      colorClass: 'bg-warm-orange/15 text-warm-orange',
    },
  ];

  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
      whileHover={{ y: -6 }}
      className="group relative overflow-hidden rounded-3xl border border-white/60 bg-white/70 shadow-xl shadow-primary-blue/8 backdrop-blur-md transition-shadow hover:shadow-2xl hover:shadow-primary-blue/12"
    >
      {/* Gradient accent bar */}
      <div className="absolute inset-x-0 top-0 h-1.5 bg-linear-to-r from-emerald-green via-sky-cyan to-primary-blue" />

      {/* Decorative glow */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -end-20 -top-20 h-56 w-56 rounded-full bg-emerald-green/10 blur-3xl"
        animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -bottom-16 -start-16 h-48 w-48 rounded-full bg-warm-orange/10 blur-3xl"
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
      />

      <div className="relative flex flex-col gap-8 p-6 sm:p-8 lg:flex-row lg:items-stretch lg:gap-10">
        {/* Icon panel */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative flex shrink-0 items-center justify-center lg:w-52"
        >
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="relative flex h-36 w-36 items-center justify-center rounded-2xl bg-linear-to-br from-emerald-green/20 via-sky-cyan/15 to-primary-blue/20 sm:h-44 sm:w-44"
          >
            <motion.div
              aria-hidden
              className="absolute inset-2 rounded-xl border border-white/50"
              animate={{ rotate: [0, 3, 0, -3, 0] }}
              transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
            />
            <Languages className="relative h-16 w-16 text-emerald-green sm:h-20 sm:w-20" strokeWidth={1.5} />
            <motion.div
              aria-hidden
              className="absolute -top-2 -end-2 flex h-8 w-8 items-center justify-center rounded-full bg-warm-orange shadow-md"
              animate={{ rotate: [0, 15, 0], scale: [1, 1.1, 1] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            >
              <Sparkles className="h-4 w-4 text-white" />
            </motion.div>
          </motion.div>

          {/* Arabic decorative character */}
          <motion.span
            aria-hidden
            className="pointer-events-none absolute -bottom-2 start-0 select-none text-6xl font-bold text-emerald-green/10 sm:text-7xl"
            animate={{ opacity: [0.08, 0.15, 0.08] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          >
            ع
          </motion.span>
        </motion.div>

        {/* Content */}
        <div className="flex flex-1 flex-col">
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <motion.span
              initial={{ opacity: 0, x: dir === 'rtl' ? 12 : -12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.25 }}
              className="inline-flex items-center gap-1.5 rounded-full bg-warm-orange/15 px-3 py-1 text-xs font-semibold text-warm-orange"
            >
              <Star className="h-3.5 w-3.5 fill-warm-orange" />
              {subject.badge}
            </motion.span>
            <motion.span
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="rounded-full bg-emerald-green/10 px-3 py-1 text-xs font-medium text-emerald-green"
            >
              {subject.subtitle}
            </motion.span>
          </div>

          <motion.h3
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mb-3 text-2xl font-bold text-deep-navy sm:text-3xl"
          >
            {subject.title}
          </motion.h3>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="mb-6 max-w-2xl text-base leading-relaxed text-deep-navy/70"
          >
            {subject.description}
          </motion.p>

          {/* Stats grid */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-40px' }}
            className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4"
          >
            {stats.map((stat) => (
              <StatBox key={stat.label} {...stat} />
            ))}
          </motion.div>

          {/* Topics */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="mb-6"
          >
            <p className="mb-3 flex items-center gap-2 text-sm font-semibold text-deep-navy">
              <BookOpen className="h-4 w-4 text-primary-blue" />
              {t.subjects.topicsLabel}
            </p>
            <div className="flex flex-wrap gap-2">
              {subject.topics.map((topic, i) => (
                <motion.span
                  key={topic}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.45 + i * 0.07 }}
                  whileHover={{ scale: 1.04, backgroundColor: 'rgba(26, 115, 232, 0.12)' }}
                  className="cursor-default rounded-lg border border-primary-blue/15 bg-primary-blue/5 px-3 py-1.5 text-sm font-medium text-deep-navy/80 transition-colors"
                >
                  {topic}
                </motion.span>
              ))}
            </div>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="mt-auto"
          >
            <motion.a
              href={`#subject-${subject.id}`}
              whileHover={{ scale: 1.03, boxShadow: '0 10px 30px rgba(255, 111, 0, 0.3)' }}
              whileTap={{ scale: 0.97 }}
              className="group/btn inline-flex items-center gap-2 rounded-xl bg-bright-orange px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-bright-orange/25"
            >
              {subject.cta}
              <Arrow className="h-4 w-4 transition-transform group-hover/btn:translate-x-0.5 rtl:group-hover/btn:-translate-x-0.5" />
            </motion.a>
          </motion.div>
        </div>
      </div>
    </motion.article>
  );
}

export default function SubjectsSection() {
  const { t, dir } = useLanguage();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const textAlign = dir === 'rtl' ? 'text-right' : 'text-left';

  return (
    <section
      id="subjects"
      ref={ref}
      className="relative overflow-hidden bg-linear-to-b from-[#e8faf5]/40 via-white to-[#f0f7ff]/60 py-24"
    >
      {/* Background decorations */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute start-0 top-1/4 h-72 w-72 rounded-full bg-emerald-green/8 blur-3xl"
        animate={isInView ? { scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] } : {}}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute end-0 bottom-1/4 h-64 w-64 rounded-full bg-primary-blue/8 blur-3xl"
        animate={isInView ? { scale: [1, 1.15, 1] } : {}}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
      />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section header */}
        <div className={`mx-auto mb-14 max-w-2xl text-center ${textAlign} lg:mx-0 lg:max-w-none lg:text-start`}>
          <motion.div
            custom={0}
            variants={fadeUp}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-green/25 bg-emerald-green/8 px-4 py-2 text-sm font-medium text-emerald-green"
          >
            <BookOpen className="h-4 w-4" />
            {t.subjects.badge}
          </motion.div>

          <motion.h2
            custom={0.1}
            variants={fadeUp}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            className="mb-4 text-3xl font-bold text-deep-navy sm:text-4xl lg:text-5xl"
          >
            {t.subjects.title}{' '}
            <span className="bg-linear-to-r from-emerald-green via-sky-cyan to-primary-blue bg-clip-text text-transparent">
              {t.subjects.titleHighlight}
            </span>
          </motion.h2>

          <motion.p
            custom={0.2}
            variants={fadeUp}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            className="text-lg leading-relaxed text-deep-navy/65"
          >
            {t.subjects.description}
          </motion.p>
        </div>

        {/* Subject cards */}
        <div className="space-y-6">
          <SubjectCard subject={t.subjects.items.arabic} />
        </div>

        {/* View all placeholder */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mt-10 text-center"
        >
          <motion.button
            type="button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex items-center gap-2 rounded-xl border-2 border-dashed border-primary-blue/25 px-6 py-3 text-sm font-medium text-primary-blue transition-colors hover:border-primary-blue/50 hover:bg-primary-blue/5"
          >
            <Sparkles className="h-4 w-4" />
            {t.subjects.viewAll}
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
