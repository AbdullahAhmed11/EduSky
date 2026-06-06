export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').trim();
}

export function localizedName(
  item: { nameAr?: string; nameEn?: string; name?: string } | undefined,
  lang: 'ar' | 'en',
): string {
  if (!item) return '';
  if (lang === 'ar') return item.nameAr ?? item.nameEn ?? item.name ?? '';
  return item.nameEn ?? item.nameAr ?? item.name ?? '';
}

export function formatDateRange(start: string, end: string, locale: string): string {
  const opts: Intl.DateTimeFormatOptions = { dateStyle: 'medium' };
  const startDate = new Date(start).toLocaleDateString(locale, opts);
  const endDate = new Date(end).toLocaleDateString(locale, opts);
  return `${startDate} – ${endDate}`;
}
