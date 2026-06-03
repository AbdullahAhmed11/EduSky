import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Clock, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getExams } from '../../api/exams';
import { Badge, Card, LoadingSpinner, PageHeader } from '../../components/ui';
import { useLanguage } from '../../i18n/LanguageContext';
import { usePurchases } from '../../hooks/usePurchases';
import { getExamAccess } from '../../utils/examAccess';

export default function ExamsPage() {
  const { t } = useLanguage();
  const { data: exams = [], isLoading } = useQuery({ queryKey: ['exams'], queryFn: () => getExams() });
  const { data: purchases = [] } = usePurchases();

  const accessLabel = {
    free: t.examsPage.free,
    locked: t.examsPage.locked,
    pending: t.examsPage.pending,
    ready: t.examsPage.ready,
  };

  const accessVariant = {
    free: 'success' as const,
    locked: 'default' as const,
    pending: 'warning' as const,
    ready: 'success' as const,
  };

  return (
    <div>
      <PageHeader badge={t.examsPage.badge} title={t.examsPage.title} highlight={t.examsPage.highlight} description={t.examsPage.description} />

      {isLoading ? (
        <LoadingSpinner />
      ) : exams.length === 0 ? (
        <p className="text-center text-deep-navy/50">{t.examsPage.noExams}</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {exams.map((exam, i) => {
            const access = getExamAccess(exam, purchases);
            return (
              <motion.div key={exam.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <Card className="flex h-full flex-col">
                  <div className="mb-3 flex flex-wrap gap-2">
                    <Badge variant={exam.isPaid ? 'warning' : 'success'}>{exam.isPaid ? t.examsPage.paid : t.examsPage.free}</Badge>
                    <Badge variant={accessVariant[access]}>{accessLabel[access]}</Badge>
                  </div>
                  <h3 className="mb-2 font-bold text-deep-navy">{exam.title}</h3>
                  {exam.description && <p className="mb-4 flex-1 text-sm text-deep-navy/60 line-clamp-2">{exam.description}</p>}
                  <div className="mb-4 flex gap-4 text-sm text-deep-navy/55">
                    <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{exam.duration} {t.examsPage.minutes}</span>
                    <span className="flex items-center gap-1"><FileText className="h-3.5 w-3.5" />{exam.questions.length} {t.examsPage.questions}</span>
                  </div>
                  {exam.isPaid && exam.price && <p className="mb-3 text-sm font-semibold text-warm-orange">{exam.price} EGP</p>}
                  <Link to={`/exams/${exam.id}`} className="mt-auto inline-flex rounded-xl bg-primary-blue/10 px-4 py-2 text-sm font-semibold text-primary-blue hover:bg-primary-blue/15">
                    {t.examsPage.viewDetails}
                  </Link>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
