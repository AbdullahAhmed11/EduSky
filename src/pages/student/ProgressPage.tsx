import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { getStudentExams, getStudentMistakes, getStudentPointsHistory } from '../../api/students';
import { Badge, Card, LoadingSpinner, PageHeader } from '../../components/ui';
import { useAuth, getStudentId } from '../../context/AuthContext';
import { useLanguage } from '../../i18n/LanguageContext';

type Tab = 'history' | 'mistakes' | 'points';

export default function ProgressPage() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const studentId = getStudentId(user);
  const [tab, setTab] = useState<Tab>('history');

  const { data: history = [], isLoading: hLoading } = useQuery({
    queryKey: ['examHistory', studentId],
    queryFn: () => getStudentExams(studentId!),
    enabled: !!studentId,
  });

  const { data: mistakes = [], isLoading: mLoading } = useQuery({
    queryKey: ['mistakes', studentId],
    queryFn: () => getStudentMistakes(studentId!),
    enabled: !!studentId && tab === 'mistakes',
  });

  const { data: points = [], isLoading: pLoading } = useQuery({
    queryKey: ['pointsHistory', studentId],
    queryFn: () => getStudentPointsHistory(studentId!),
    enabled: !!studentId && tab === 'points',
  });

  const tabs: { key: Tab; label: string }[] = [
    { key: 'history', label: t.progressPage.tabs.history },
    { key: 'mistakes', label: t.progressPage.tabs.mistakes },
    { key: 'points', label: t.progressPage.tabs.points },
  ];

  const loading = tab === 'history' ? hLoading : tab === 'mistakes' ? mLoading : pLoading;

  return (
    <div>
      <PageHeader badge={t.progressPage.badge} title={t.progressPage.title} />

      <div className="mb-6 flex gap-2 overflow-x-auto rounded-xl bg-white/80 p-1">
        {tabs.map(({ key, label }) => (
          <button
            key={key}
            type="button"
            onClick={() => setTab(key)}
            className={`shrink-0 rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
              tab === key ? 'bg-primary-blue text-white' : 'text-deep-navy/60'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : tab === 'history' ? (
        history.length === 0 ? (
          <p className="text-center text-deep-navy/50">{t.progressPage.noHistory}</p>
        ) : (
          <div className="space-y-3">
            {history.map((item, i) => (
              <motion.div key={item.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
                <Card className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-deep-navy">{item.examTitle}</h3>
                    <p className="text-sm text-deep-navy/55">{new Date(item.submittedAt).toLocaleDateString()}</p>
                  </div>
                  <Badge variant="success">{item.percentage}%</Badge>
                </Card>
              </motion.div>
            ))}
          </div>
        )
      ) : tab === 'mistakes' ? (
        mistakes.length === 0 ? (
          <p className="text-center text-deep-navy/50">{t.progressPage.noMistakes}</p>
        ) : (
          <div className="space-y-3">
            {mistakes.map((m) => (
              <Card key={m.id}>
                <p className="mb-1 text-xs text-deep-navy/50">{m.examTitle}</p>
                <p className="font-medium text-deep-navy">{m.question}</p>
                <p className="mt-1 text-sm text-red-500">{m.options[m.selectedAnswer]}</p>
                <p className="text-sm text-emerald-green">{m.options[m.correctAnswer]}</p>
              </Card>
            ))}
          </div>
        )
      ) : points.length === 0 ? (
        <p className="text-center text-deep-navy/50">{t.progressPage.noPoints}</p>
      ) : (
        <div className="space-y-3">
          {points.map((p) => (
            <Card key={p.id} className="flex items-center justify-between">
              <div>
                <p className="font-medium text-deep-navy">{p.sourceTitle}</p>
                <p className="text-sm text-deep-navy/55">{new Date(p.earnedAt).toLocaleDateString()}</p>
              </div>
              <div className="text-end">
                <Badge variant="success">+{p.points}</Badge>
                {p.leveledUp && <p className="mt-1 text-xs text-warm-orange">{t.progressPage.leveledUp}</p>}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
