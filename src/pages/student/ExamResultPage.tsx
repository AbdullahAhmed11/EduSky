import { motion } from 'framer-motion';
import { CheckCircle, XCircle } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { Button, Card, PageHeader } from '../../components/ui';
import { useLanguage } from '../../i18n/LanguageContext';
import type { ExamResult } from '../../types/api';

export default function ExamResultPage() {
  const { t } = useLanguage();
  const location = useLocation();
  const result = (location.state as { result?: ExamResult })?.result;

  if (!result) {
    return (
      <div className="text-center">
        <p className="text-deep-navy/60">{t.auth.errorGeneric}</p>
        <Link to="/dashboard"><Button className="mt-4">{t.examsPage.backDashboard}</Button></Link>
      </div>
    );
  }

  return (
    <div>
      <PageHeader title={t.examsPage.resultTitle} />

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="mb-8 flex flex-col items-center"
      >
        <div className="relative mb-4 flex h-32 w-32 items-center justify-center rounded-full bg-linear-to-br from-primary-blue/20 to-emerald-green/20">
          <span className="text-4xl font-bold text-deep-navy">{result.percentage}%</span>
        </div>
        <p className="text-lg text-deep-navy/70">
          {t.examsPage.score}: {result.totalScore}/{result.totalPoints}
        </p>
      </motion.div>

      <div className="space-y-4">
        {result.answers.map((a, i) => (
          <Card key={i}>
            <div className="mb-2 flex items-start gap-2">
              {a.isCorrect ? (
                <CheckCircle className="h-5 w-5 shrink-0 text-emerald-green" />
              ) : (
                <XCircle className="h-5 w-5 shrink-0 text-red-500" />
              )}
              <div>
                <p className="font-medium text-deep-navy">{a.question}</p>
                <p className="mt-1 text-sm text-deep-navy/60">
                  {a.isCorrect ? t.examsPage.correct : t.examsPage.wrong}: {a.options[a.selectedAnswer] ?? '—'}
                </p>
                {!a.isCorrect && a.correctAnswerReason && (
                  <p className="mt-2 text-sm text-primary-blue">{a.correctAnswerReason}</p>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link to="/progress"><Button variant="outline">{t.examsPage.reviewMistakes}</Button></Link>
        <Link to="/dashboard"><Button variant="outline">{t.examsPage.backDashboard}</Button></Link>
        <Link to="/exams"><Button>{t.examsPage.browseMore}</Button></Link>
      </div>
    </div>
  );
}
