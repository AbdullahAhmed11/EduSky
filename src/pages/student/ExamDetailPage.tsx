import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Clock, FileText, ImagePlus, Upload } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getExam, buyExam } from '../../api/exams';
import { ApiError } from '../../api/client';
import { Badge, Button, Card, LoadingSpinner, PageHeader } from '../../components/ui';
import { getStudentId, useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../i18n/LanguageContext';
import { usePurchases } from '../../hooks/usePurchases';
import { getExamAccess } from '../../utils/examAccess';

export default function ExamDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { user } = useAuth();
  const studentId = getStudentId(user);

  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [transferFile, setTransferFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [purchaseError, setPurchaseError] = useState('');

  const { data: exam, isLoading } = useQuery({
    queryKey: ['exam', id],
    queryFn: () => getExam(id!),
    enabled: !!id,
  });

  const { data: purchases = [] } = usePurchases();

  useEffect(() => {
    if (!transferFile) {
      setPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(transferFile);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [transferFile]);

  const purchaseMutation = useMutation({
    mutationFn: (file: File) => {
      if (!studentId) throw new Error('Student not found');
      return buyExam(id!, studentId, file);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['purchases'] });
      setShowPurchaseModal(false);
      setTransferFile(null);
      setPurchaseError('');
    },
    onError: (err) => {
      setPurchaseError(err instanceof ApiError ? err.message : t.auth.errorGeneric);
    },
  });

  if (isLoading || !exam) return <LoadingSpinner />;

  const access = getExamAccess(exam, purchases);

  const handleAction = () => {
    if (access === 'free' || access === 'ready') {
      navigate(`/exams/${id}/take`);
    } else if (access === 'locked') {
      setPurchaseError('');
      setTransferFile(null);
      setShowPurchaseModal(true);
    }
  };

  const handleSubmitPurchase = () => {
    if (!transferFile) {
      setPurchaseError(t.examsPage.transferRequired);
      return;
    }
    purchaseMutation.mutate(transferFile);
  };

  return (
    <div>
      <PageHeader title={exam.title} description={exam.description} />

      <Card className="max-w-2xl">
        <div className="mb-4 flex flex-wrap gap-2">
          <Badge variant={exam.isPaid ? 'warning' : 'success'}>{exam.isPaid ? t.examsPage.paid : t.examsPage.free}</Badge>
          {access === 'pending' && <Badge variant="warning">{t.examsPage.awaitingApproval}</Badge>}
        </div>

        <div className="mb-6 flex flex-wrap gap-6 text-deep-navy/70">
          <span className="flex items-center gap-2"><Clock className="h-4 w-4" />{exam.duration} {t.examsPage.minutes}</span>
          <span className="flex items-center gap-2"><FileText className="h-4 w-4" />{exam.questions.length} {t.examsPage.questions}</span>
          <span>{exam.totalPoints} {t.examsPage.points}</span>
        </div>

        {exam.isPaid && exam.price && (
          <p className="mb-6 text-lg font-bold text-warm-orange">{exam.price} EGP</p>
        )}

        <div className="flex flex-wrap gap-3">
          {access === 'pending' ? (
            <Button disabled>{t.examsPage.awaitingApproval}</Button>
          ) : (
            <Button onClick={handleAction} disabled={purchaseMutation.isPending}>
              {access === 'locked' ? t.examsPage.requestPurchase : t.examsPage.startExam}
            </Button>
          )}
          <Link to="/exams">
            <Button variant="outline">{t.examsPage.back}</Button>
          </Link>
        </div>
      </Card>

      {showPurchaseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-deep-navy/40 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
          >
            <h3 className="mb-2 text-xl font-bold text-deep-navy">{t.examsPage.purchaseModalTitle}</h3>
            <p className="mb-1 text-sm text-deep-navy/60">{exam.title}</p>
            {exam.price && (
              <p className="mb-4 text-lg font-semibold text-warm-orange">{exam.price} EGP</p>
            )}

            <p className="mb-4 text-sm text-deep-navy/70">{t.examsPage.transferHint}</p>

            <label className="mb-4 flex cursor-pointer flex-col items-center gap-3 rounded-xl border-2 border-dashed border-primary-blue/25 bg-primary-blue/5 px-4 py-6 transition-colors hover:border-primary-blue/40 hover:bg-primary-blue/8">
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0] ?? null;
                  setTransferFile(file);
                  setPurchaseError('');
                }}
              />
              {previewUrl ? (
                <img src={previewUrl} alt="" className="max-h-40 rounded-lg object-contain" />
              ) : (
                <>
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary-blue/10">
                    <ImagePlus className="h-7 w-7 text-primary-blue" />
                  </div>
                  <span className="text-sm font-medium text-primary-blue">{t.examsPage.chooseImage}</span>
                </>
              )}
              <span className="text-xs text-deep-navy/50">{t.examsPage.transferScreenshot}</span>
            </label>

            {purchaseError && <p className="mb-3 text-sm text-red-500">{purchaseError}</p>}

            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => {
                  setShowPurchaseModal(false);
                  setTransferFile(null);
                  setPurchaseError('');
                }}
              >
                {t.examsPage.cancel}
              </Button>
              <Button
                className="flex-1"
                onClick={handleSubmitPurchase}
                disabled={purchaseMutation.isPending || !transferFile}
              >
                <Upload className="h-4 w-4" />
                {purchaseMutation.isPending ? '...' : t.examsPage.submitPurchase}
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
