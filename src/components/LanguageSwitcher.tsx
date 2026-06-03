import { Globe } from 'lucide-react';
import type { ChangeEvent } from 'react';
import { useLanguage, type Language } from '../i18n/LanguageContext';

export default function LanguageSwitcher({ className = '' }: { className?: string }) {
  const { language, setLanguage } = useLanguage();

  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setLanguage(e.target.value as Language);
  };

  return (
    <div className={`relative flex items-center ${className}`}>
      <Globe className="pointer-events-none absolute start-3 h-4 w-4 text-deep-navy/50" />
      <select
        value={language}
        onChange={handleChange}
        aria-label="Select language"
        className="cursor-pointer appearance-none rounded-lg border border-primary-blue/20 bg-white/80 py-2 ps-9 pe-8 text-sm font-medium text-deep-navy transition-colors hover:border-primary-blue/40 focus:border-primary-blue focus:outline-none focus:ring-2 focus:ring-primary-blue/20"
      >
        <option value="en">English</option>
        <option value="ar">العربية</option>
      </select>
    </div>
  );
}
