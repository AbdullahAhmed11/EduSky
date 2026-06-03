import { motion, useInView, type Variants } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  Award,
  BookOpen,
  GraduationCap,
  Languages,
  Sparkles,
  Star,
  Users,
} from 'lucide-react';
import { useRef } from 'react';
import mrAshrafImg from '../assets/mrAshraf.jpg';
import { useLanguage } from '../i18n/LanguageContext';
import type { TeacherItem } from '../i18n/locales/en';

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
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
};

const statVariant: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' } },
};

function TeacherCard({ teacher }: { teacher: TeacherItem }) {
  const { t, dir } = useLanguage();
  const Arrow = dir === 'rtl' ? ArrowLeft : ArrowRight;

  const stats = [
    { icon: Award, value: teacher.experience, label: t.teachers.stats.experience, color: 'text-warm-orange', bg: 'bg-warm-orange/12' },
    { icon: Users, value: teacher.students, label: t.teachers.stats.students, color: 'text-sky-cyan', bg: 'bg-sky-cyan/12' },
    { icon: BookOpen, value: teacher.lectures, label: t.teachers.stats.lectures, color: 'text-primary-blue', bg: 'bg-primary-blue/12' },
    { icon: Star, value: teacher.rating, label: t.teachers.stats.rating, color: 'text-emerald-green', bg: 'bg-emerald-green/12' },
  ];

  return (
    <motion.article
      initial={{ opacity: 0, y: 48 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.75, ease: 'easeOut' }}
      className="group relative overflow-hidden rounded-3xl border border-white/60 bg-white/75 shadow-2xl shadow-primary-blue/10 backdrop-blur-md"
    >
      <div className="absolute inset-x-0 top-0 h-1.5 bg-linear-to-r from-primary-blue via-sky-cyan to-emerald-green" />

      <motion.div
        aria-hidden
        className="pointer-events-none absolute -end-24 top-1/4 h-64 w-64 rounded-full bg-primary-blue/8 blur-3xl"
        animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.65, 0.4] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div
        className={`relative flex flex-col gap-10 p-6 sm:p-8 lg:gap-14 lg:p-10 ${dir === 'rtl' ? 'lg:flex-row-reverse' : 'lg:flex-row'}`}
      >
        {/* Photo panel */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="relative mx-auto shrink-0 lg:mx-0"
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            className="relative"
          >
            {/* Rotating gradient ring */}
            <motion.div
              aria-hidden
              className="absolute -inset-3 rounded-[2rem] bg-linear-to-br from-primary-blue via-sky-cyan to-emerald-green opacity-80"
              animate={{ rotate: 360 }}
              transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
            />
            <div className="absolute -inset-3 rounded-[2rem] bg-linear-to-br from-primary-blue via-sky-cyan to-emerald-green opacity-20 blur-md" />

            <div className="relative overflow-hidden rounded-[1.75rem] ring-4 ring-white">
              <motion.img
                src={mrAshrafImg}
                alt={teacher.imageAlt}
                className="h-72 w-64 object-cover object-top sm:h-80 sm:w-72 lg:h-[22rem] lg:w-80"
                whileHover={{ scale: 1.04 }}
                transition={{ duration: 0.4 }}
              />
              <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-deep-navy/30 via-transparent to-transparent" />
            </div>

            {/* Rating badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
              className="absolute -bottom-3 start-1/2 flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-white px-4 py-2 shadow-lg ring-1 ring-emerald-green/20 rtl:translate-x-1/2"
            >
              <Star className="h-4 w-4 fill-warm-orange text-warm-orange" />
              <span className="text-sm font-bold text-deep-navy">{teacher.rating}</span>
            </motion.div>

            {/* Lead badge */}
            <motion.div
              initial={{ opacity: 0, x: dir === 'rtl' ? -16 : 16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="absolute -top-2 -end-2 flex items-center gap-1 rounded-full bg-bright-orange px-3 py-1.5 text-xs font-semibold text-white shadow-md"
            >
              <GraduationCap className="h-3.5 w-3.5" />
              {teacher.badge}
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Info panel */}
        <div className="flex flex-1 flex-col justify-center">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.25 }}
            className="mb-3 inline-flex w-fit items-center gap-2 rounded-full bg-emerald-green/10 px-3 py-1 text-sm font-medium text-emerald-green"
          >
            <Languages className="h-4 w-4" />
            {teacher.subject}
          </motion.div>

          <motion.h3
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="mb-1 text-3xl font-bold text-deep-navy sm:text-4xl"
          >
            {teacher.name}
          </motion.h3>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.35 }}
            className="mb-5 text-lg font-medium text-primary-blue"
          >
            {teacher.role}
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="mb-6 max-w-xl text-base leading-relaxed text-deep-navy/70"
          >
            {teacher.bio}
          </motion.p>

          {/* Highlight tags */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.45 }}
            className="mb-7 flex flex-wrap gap-2"
          >
            {teacher.highlights.map((tag, i) => (
              <motion.span
                key={tag}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 + i * 0.08 }}
                whileHover={{ scale: 1.05 }}
                className="rounded-lg border border-primary-blue/15 bg-primary-blue/5 px-3 py-1.5 text-sm font-medium text-deep-navy/80"
              >
                {tag}
              </motion.span>
            ))}
          </motion.div>

          {/* Stats */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4"
          >
            {stats.map(({ icon: Icon, value, label, color, bg }) => (
              <motion.div
                key={label}
                variants={statVariant}
                whileHover={{ y: -4 }}
                className="flex flex-col items-center gap-1.5 rounded-xl bg-white/90 px-3 py-4 shadow-sm"
              >
                <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${bg}`}>
                  <Icon className={`h-4 w-4 ${color}`} />
                </div>
                <span className="text-lg font-bold text-deep-navy">{value}</span>
                <span className="text-center text-xs text-deep-navy/55">{label}</span>
              </motion.div>
            ))}
          </motion.div>

          <motion.a
            href="#subject-arabic"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.55 }}
            whileHover={{ scale: 1.03, boxShadow: '0 10px 30px rgba(255, 111, 0, 0.3)' }}
            whileTap={{ scale: 0.97 }}
            className="group/btn inline-flex w-fit items-center gap-2 rounded-xl bg-bright-orange px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-bright-orange/25"
          >
            {t.teachers.cta}
            <Arrow className="h-4 w-4 transition-transform group-hover/btn:translate-x-0.5 rtl:group-hover/btn:-translate-x-0.5" />
          </motion.a>
        </div>
      </div>
    </motion.article>
  );
}

export default function TeachersSection() {
  const { t, dir } = useLanguage();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section
      id="teachers"
      ref={ref}
      className="relative overflow-hidden bg-linear-to-b from-[#f0f7ff]/50 via-white to-[#e8faf5]/30 py-24"
    >
      <motion.div
        aria-hidden
        className="pointer-events-none absolute end-0 top-20 h-80 w-80 rounded-full bg-sky-cyan/8 blur-3xl"
        animate={isInView ? { scale: [1, 1.15, 1] } : {}}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute start-0 bottom-10 h-72 w-72 rounded-full bg-warm-orange/8 blur-3xl"
        animate={isInView ? { opacity: [0.3, 0.55, 0.3] } : {}}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div className={`mb-14 text-center ${dir === 'rtl' ? 'lg:text-right' : 'lg:text-left'}`}>
          <motion.div
            custom={0}
            variants={fadeUp}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary-blue/20 bg-primary-blue/8 px-4 py-2 text-sm font-medium text-primary-blue"
          >
            <GraduationCap className="h-4 w-4" />
            {t.teachers.badge}
          </motion.div>

          <motion.h2
            custom={0.1}
            variants={fadeUp}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            className="mb-4 text-3xl font-bold text-deep-navy sm:text-4xl lg:text-5xl"
          >
            {t.teachers.title}{' '}
            <span className="bg-linear-to-r from-primary-blue via-sky-cyan to-emerald-green bg-clip-text text-transparent">
              {t.teachers.titleHighlight}
            </span>
          </motion.h2>

          <motion.p
            custom={0.2}
            variants={fadeUp}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            className="mx-auto max-w-2xl text-lg leading-relaxed text-deep-navy/65 lg:mx-0"
          >
            {t.teachers.description}
          </motion.p>
        </div>

        <TeacherCard teacher={t.teachers.items.ashraf} />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mt-10 text-center"
        >
          <motion.button
            type="button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex items-center gap-2 rounded-xl border-2 border-dashed border-emerald-green/30 px-6 py-3 text-sm font-medium text-emerald-green transition-colors hover:border-emerald-green/50 hover:bg-emerald-green/5"
          >
            <Sparkles className="h-4 w-4" />
            {t.teachers.viewAll}
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
