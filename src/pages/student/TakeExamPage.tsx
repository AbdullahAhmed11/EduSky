import { useMutation, useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getExam, solveExam } from '../../api/exams';
import { ApiError } from '../../api/client';
import { Button, LoadingSpinner } from '../../components/ui';
import { useLanguage } from '../../i18n/LanguageContext';

export default function TakeExamPage() {
  const { id } = useParams<{ id: string }>();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const { data: exam, isLoading } = useQuery({
    queryKey: ['exam', id],
    queryFn: () => getExam(id!),
    enabled: !!id,
  });

  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [confirm, setConfirm] = useState(false);

  useEffect(() => {
    if (exam) {
      setAnswers(Array(exam.questions.length).fill(-1));
      setTimeLeft(exam.duration * 60);
    }
  }, [exam]);

  useEffect(() => {
    if (timeLeft <= 0 || !exam) return;
    const timer = setInterval(() => setTimeLeft((t) => Math.max(0, t - 1)), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, exam]);

  const solveMutation = useMutation({
    mutationFn: () => solveExam(id!, answers),
    onSuccess: (data) => {
      navigate(`/exams/${id}/result`, { state: { result: data.result } });
    },
  });

  const submit = () => {
    solveMutation.mutate();
    setConfirm(false);
  };

  if (isLoading || !exam) return <LoadingSpinner />;

  const q = exam.questions[current];
  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6 flex items-center justify-between rounded-xl bg-white/80 px-4 py-3 shadow-sm">
        <span className="text-sm font-medium text-deep-navy">
          {t.examsPage.questionOf} {current + 1}/{exam.questions.length}
        </span>
        <span className={`font-mono font-bold ${timeLeft < 60 ? 'text-red-500' : 'text-primary-blue'}`}>
          {t.examsPage.timeLeft}: {mins}:{secs.toString().padStart(2, '0')}
        </span>
      </div>

      <motion.div key={current} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="mb-6 rounded-2xl border border-white/60 bg-white/80 p-6 shadow-lg">
        <h2 className="mb-6 text-lg font-semibold text-deep-navy">{q.question}</h2>
        <div className="space-y-3">
          {q.options.map((opt, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                const next = [...answers];
                next[current] = idx;
                setAnswers(next);
              }}
              className={`w-full rounded-xl border-2 px-4 py-3 text-start text-sm font-medium transition-colors ${
                answers[current] === idx
                  ? 'border-primary-blue bg-primary-blue/10 text-primary-blue'
                  : 'border-primary-blue/15 text-deep-navy hover:border-primary-blue/40'
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      </motion.div>

      <div className="flex flex-wrap gap-2 mb-4">
        {exam.questions.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setCurrent(i)}
            className={`h-8 w-8 rounded-lg text-xs font-semibold ${
              i === current ? 'bg-primary-blue text-white' : answers[i] >= 0 ? 'bg-emerald-green/20 text-emerald-green' : 'bg-white/80 text-deep-navy/50'
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>

      <div className="flex gap-3">
        <Button variant="outline" disabled={current === 0} onClick={() => setCurrent((c) => c - 1)}>{t.examsPage.back}</Button>
        {current < exam.questions.length - 1 ? (
          <Button onClick={() => setCurrent((c) => c + 1)}>Next</Button>
        ) : (
          <Button onClick={() => setConfirm(true)} disabled={solveMutation.isPending}>{t.examsPage.submitExam}</Button>
        )}
      </div>

      {confirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-deep-navy/40 p-4">
          <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
            <p className="mb-6 text-deep-navy">{t.examsPage.confirmSubmit}</p>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setConfirm(false)}>{t.examsPage.back}</Button>
              <Button onClick={submit} disabled={solveMutation.isPending}>{t.examsPage.submitExam}</Button>
            </div>
            {solveMutation.isError && (
              <p className="mt-3 text-sm text-red-500">{(solveMutation.error as ApiError).message}</p>
            )}
          </motion.div>
        </div>
      )}
    </div>
  );
}
