type LogoProps = {
  size?: 'sm' | 'md' | 'lg';
  theme?: 'light' | 'dark';
  className?: string;
};

const sizes = {
  sm: 'text-xl',
  md: 'text-2xl',
  lg: 'text-3xl',
};

export default function Logo({ size = 'md', theme = 'light', className = '' }: LogoProps) {
  const eduColor =
    theme === 'dark'
      ? 'text-white group-hover:text-sky-cyan'
      : 'text-deep-navy group-hover:text-primary-blue';

  return (
    <a
      href="/"
      dir="ltr"
      aria-label="EduSky"
      className={`group inline-flex shrink-0 items-center whitespace-nowrap font-bold tracking-tight ${sizes[size]} ${className}`}
    >
      <span className={`transition-colors ${eduColor}`}>Edu</span>
      <span className="bg-linear-to-r from-emerald-green via-sky-cyan to-primary-blue bg-clip-text text-transparent">
        Sky
      </span>
    </a>
  );
}
