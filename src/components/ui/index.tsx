import { motion, type Variants } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay, ease: 'easeOut' },
  }),
};

export function PageHeader({
  badge,
  title,
  highlight,
  description,
}: {
  badge?: string;
  title: string;
  highlight?: string;
  description?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-8"
    >
      {badge && (
        <span className="mb-3 inline-flex rounded-full border border-primary-blue/20 bg-primary-blue/8 px-3 py-1 text-sm font-medium text-primary-blue">
          {badge}
        </span>
      )}
      <h1 className="text-2xl font-bold text-deep-navy sm:text-3xl">
        {title}{' '}
        {highlight && (
          <span className="bg-linear-to-r from-emerald-green via-sky-cyan to-primary-blue bg-clip-text text-transparent">
            {highlight}
          </span>
        )}
      </h1>
      {description && <p className="mt-2 text-deep-navy/65">{description}</p>}
    </motion.div>
  );
}

export function Card({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      className={`rounded-2xl border border-white/60 bg-white/80 p-5 shadow-lg shadow-primary-blue/5 backdrop-blur-sm ${className}`}
    >
      {children}
    </motion.div>
  );
}

export function StatBox({
  icon: Icon,
  value,
  label,
  colorClass,
}: {
  icon: LucideIcon;
  value: string | number;
  label: string;
  colorClass: string;
}) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="flex flex-col items-center gap-1 rounded-xl bg-white/90 px-4 py-4 shadow-sm"
    >
      <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${colorClass}`}>
        <Icon className="h-4 w-4" />
      </div>
      <span className="text-xl font-bold text-deep-navy">{value}</span>
      <span className="text-center text-xs text-deep-navy/55">{label}</span>
    </motion.div>
  );
}

export function Badge({
  children,
  variant = 'default',
}: {
  children: ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
}) {
  const styles = {
    default: 'bg-primary-blue/10 text-primary-blue',
    success: 'bg-emerald-green/10 text-emerald-green',
    warning: 'bg-warm-orange/10 text-warm-orange',
    error: 'bg-red-100 text-red-600',
    info: 'bg-sky-cyan/10 text-sky-cyan',
  };
  return (
    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${styles[variant]}`}>
      {children}
    </span>
  );
}

export function Button({
  children,
  variant = 'primary',
  className = '',
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'outline';
}) {
  const styles = {
    primary: 'bg-bright-orange text-white shadow-lg shadow-bright-orange/25 hover:shadow-bright-orange/35',
    secondary: 'bg-primary-blue text-white shadow-lg shadow-primary-blue/20',
    outline: 'border-2 border-primary-blue/30 text-primary-blue hover:bg-primary-blue/5',
  };
  return (
    <motion.button
      whileHover={{ scale: props.disabled ? 1 : 1.02 }}
      whileTap={{ scale: props.disabled ? 1 : 0.98 }}
      className={`inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold transition-shadow disabled:cursor-not-allowed disabled:opacity-50 ${styles[variant]} ${className}`}
      {...(props as object)}
    >
      {children}
    </motion.button>
  );
}

export function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center py-20">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        className="h-10 w-10 rounded-full border-4 border-primary-blue/20 border-t-primary-blue"
      />
    </div>
  );
}

export function EmptyState({ message }: { message: string }) {
  return (
    <motion.p
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="py-12 text-center text-deep-navy/50"
    >
      {message}
    </motion.p>
  );
}
