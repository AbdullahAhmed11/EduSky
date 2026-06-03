import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { getLinkedStudent } from '../../api/parents';
import { getStudentExams, getStudentMistakes } from '../../api/students';
import { Badge, Card, LoadingSpinner, PageHeader, StatBox } from '../../components/ui';
import { Award, BookOpen, TrendingUp } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';

export default function ParentDashboardPage() {
  const { t } = useLanguage();

  const { data: child, isLoading } = useQuery({
    queryKey: ['linkedStudent'],
    queryFn: getLinkedStudent,
  });

  const { data: history = [] } = useQuery({
    queryKey: ['childExams', child?.id],
    queryFn: () => getStudentExams(child!.id),
    enabled: !!child?.id,
    retry: false,
  });

  const { data: mistakes = [], isError: mistakesError } = useQuery({
    queryKey: ['childMistakes', child?.id],
    queryFn: () => getStudentMistakes(child!.id),
    enabled: !!child?.id,
    retry: false,
  });

  if (isLoading) return <LoadingSpinner />;
  if (!child) return <p className="text-center text-deep-navy/50">{t.parent.noAccess}</p>;

  return (
    <div>
      <PageHeader badge={t.parent.badge} title={t.parent.title} />

      <Card className="mb-8">
        <h3 className="mb-4 font-semibold text-deep-navy">{t.parent.childProfile}</h3>
        <div className="grid gap-4 sm:grid-cols-3">
          <StatBox icon={BookOpen} value={child.studentCode} label={t.parent.studentCode} colorClass="bg-primary-blue/12 text-primary-blue" />
          <StatBox icon={Award} value={child.level} label={t.parent.level} colorClass="bg-warm-orange/12 text-warm-orange" />
          <StatBox icon={TrendingUp} value={child.totalPoints} label={t.parent.points} colorClass="bg-emerald-green/12 text-emerald-green" />
        </div>
        <p className="mt-4 text-deep-navy/70">{child.username ?? child.name}</p>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <h3 className="mb-4 font-semibold text-deep-navy">{t.parent.examHistory}</h3>
          {history.length === 0 ? (
            <p className="text-sm text-deep-navy/50">{t.parent.noHistory}</p>
          ) : (
            <ul className="space-y-3">
              {history.map((item, i) => (
                <motion.li key={item.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }} className="flex justify-between rounded-lg bg-white/60 px-3 py-2">
                  <span className="text-sm font-medium text-deep-navy">{item.examTitle}</span>
                  <Badge variant="success">{item.percentage}%</Badge>
                </motion.li>
              ))}
            </ul>
          )}
        </Card>

        <Card>
          <h3 className="mb-4 font-semibold text-deep-navy">{t.parent.mistakes}</h3>
          {mistakesError ? (
            <p className="text-sm text-deep-navy/50">{t.parent.noAccess}</p>
          ) : mistakes.length === 0 ? (
            <p className="text-sm text-deep-navy/50">{t.progressPage.noMistakes}</p>
          ) : (
            <ul className="space-y-3">
              {mistakes.slice(0, 5).map((m) => (
                <li key={m.id} className="rounded-lg bg-white/60 px-3 py-2 text-sm text-deep-navy">{m.question}</li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </div>
  );
}
