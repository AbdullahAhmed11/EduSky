import { Link } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Calendar, ImagePlus, Upload } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import {
  buyLecture,
  getLectures,
  getMyAvailableLectures,
  getStudentFreeLectures,
  getStudentPaidLectures,
} from '../../api/lectures';
import { ApiError } from '../../api/client';
import { Badge, Button, Card, LoadingSpinner } from '../../components/ui';
import { getStudentId, useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../i18n/LanguageContext';
import type { Lecture } from '../../types/api';
import { formatDateRange, localizedName, stripHtml } from '../../utils/text';

type LectureSubTab = 'all' | 'free' | 'paid' | 'browse';

const LECTURE_QUERY_KEYS = ['lectures', 'lectures-my-available', 'lectures-browse'] as const;

function invalidateLectureQueries(qc: ReturnType<typeof useQueryClient>) {
  LECTURE_QUERY_KEYS.forEach((key) => qc.invalidateQueries({ queryKey: [key] }));
}

export default function LecturesTab() {
  const { t, language } = useLanguage();
  const { user } = useAuth();
  const studentId = getStudentId(user);
  const qc = useQueryClient();
  const locale = language === 'ar' ? 'ar-EG' : 'en-US';

  const [subTab, setSubTab] = useState<LectureSubTab>('all');
  const [selectedLecture, setSelectedLecture] = useState<Lecture | null>(null);
  const [transferFile, setTransferFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [purchaseError, setPurchaseError] = useState('');
  const [pendingIds, setPendingIds] = useState<Set<string>>(new Set());

  const { data: availableLectures = [] } = useQuery({
    queryKey: ['lectures-my-available'],
    queryFn: getMyAvailableLectures,
    enabled: subTab === 'browse',
  });

  const availableIds = useMemo(
    () => new Set(availableLectures.map((l) => l.id)),
    [availableLectures],
  );

  const { data: lectures = [], isLoading } = useQuery({
    queryKey: ['lectures', subTab, studentId],
    queryFn: () => {
      if (subTab === 'browse') return getLectures();
      if (!studentId) return Promise.resolve([]);
      if (subTab === 'free') return getStudentFreeLectures(studentId);
      if (subTab === 'paid') return getStudentPaidLectures(studentId);
      return getMyAvailableLectures();
    },
    enabled: subTab === 'browse' || !!studentId,
  });

  useEffect(() => {
    if (!transferFile) {
      setPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(transferFile);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [transferFile]);

  const buyMutation = useMutation({
    mutationFn: (file: File) => {
      if (!studentId || !selectedLecture) throw new Error('Missing data');
      return buyLecture(selectedLecture.id, studentId, file);
    },
    onSuccess: () => {
      if (selectedLecture) {
        setPendingIds((prev) => new Set(prev).add(selectedLecture.id));
      }
      invalidateLectureQueries(qc);
      setSelectedLecture(null);
      setTransferFile(null);
      setPurchaseError('');
    },
    onError: (err) => {
      setPurchaseError(err instanceof ApiError ? err.message : t.auth.errorGeneric);
    },
  });

  const subTabs: { key: LectureSubTab; label: string }[] = [
    { key: 'all', label: t.lecturesPage.tabs.all },
    { key: 'free', label: t.lecturesPage.tabs.free },
    { key: 'paid', label: t.lecturesPage.tabs.paid },
    { key: 'browse', label: t.lecturesPage.tabs.browse },
  ];

  const openPurchase = (lecture: Lecture) => {
    setSelectedLecture(lecture);
    setTransferFile(null);
    setPurchaseError('');
  };

  const submitPurchase = () => {
    if (!transferFile) {
      setPurchaseError(t.lecturesPage.transferRequired);
      return;
    }
    buyMutation.mutate(transferFile);
  };

  const showBuy = (lecture: Lecture) => {
    if (subTab !== 'browse' || !lecture.isPaid) return false;
    if (availableIds.has(lecture.id)) return false;
    return !pendingIds.has(lecture.id);
  };

  const isPending = (lecture: Lecture) =>
    subTab === 'browse' && lecture.isPaid && pendingIds.has(lecture.id);

  if (isLoading) return <LoadingSpinner />;

  return (
    <>
      <div className="mb-6 flex gap-2 overflow-x-auto rounded-xl bg-white/80 p-1 shadow-sm">
        {subTabs.map(({ key, label }) => (
          <button
            key={key}
            type="button"
            onClick={() => setSubTab(key)}
            className={`shrink-0 rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
              subTab === key ? 'bg-primary-blue text-white' : 'text-deep-navy/60 hover:text-primary-blue'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {lectures.length === 0 ? (
        <p className="py-12 text-center text-deep-navy/50">{t.lecturesPage.noLectures}</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {lectures.map((lecture, i) => {
            const material = localizedName(lecture.educationalMaterial, language);
            const stage = localizedName(lecture.educationalStage, language);
            const description = lecture.description ? stripHtml(lecture.description) : '';
            const pending = isPending(lecture);

            return (
              <motion.div
                key={lecture.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Card className="flex h-full flex-col">
                  <div className="mb-3 flex flex-wrap gap-2">
                    <Badge variant={lecture.isPaid ? 'warning' : 'success'}>
                      {lecture.isPaid ? t.lecturesPage.paid : t.lecturesPage.free}
                    </Badge>
                    {pending && <Badge variant="warning">{t.lecturesPage.pending}</Badge>}
                  </div>

                  <h3 className="mb-2 font-bold text-deep-navy">{lecture.name}</h3>
                  {description && (
                    <p className="mb-3 line-clamp-2 flex-1 text-sm text-deep-navy/60">{description}</p>
                  )}

                  <div className="mb-3 space-y-1.5 text-xs text-deep-navy/55">
                    {material && <p>{t.lecturesPage.material}: {material}</p>}
                    {stage && <p>{t.lecturesPage.stage}: {stage}</p>}
                    <p className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      {formatDateRange(lecture.startAt, lecture.endAt, locale)}
                    </p>
                  </div>

                  {lecture.isPaid && lecture.price != null && (
                    <p className="mb-3 text-sm font-semibold text-warm-orange">{lecture.price} EGP</p>
                  )}

                  <div className="mt-auto flex flex-wrap gap-2">
                    <Link to={`/lectures/${lecture.id}`}>
                      <Button variant="outline">{t.lecturesPage.viewDetails}</Button>
                    </Link>
                    {pending ? (
                      <Button disabled>{t.lecturesPage.awaitingApproval}</Button>
                    ) : showBuy(lecture) ? (
                      <Button onClick={() => openPurchase(lecture)}>{t.lecturesPage.buyLecture}</Button>
                    ) : null}
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}

      {selectedLecture && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-deep-navy/40 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
          >
            <h3 className="mb-2 text-xl font-bold text-deep-navy">{t.lecturesPage.purchaseModalTitle}</h3>
            <p className="mb-1 text-sm text-deep-navy/60">{selectedLecture.name}</p>
            {selectedLecture.price != null && (
              <p className="mb-4 text-lg font-semibold text-warm-orange">{selectedLecture.price} EGP</p>
            )}

            <p className="mb-4 text-sm text-deep-navy/70">{t.lecturesPage.transferHint}</p>

            <label className="mb-4 flex cursor-pointer flex-col items-center gap-3 rounded-xl border-2 border-dashed border-primary-blue/25 bg-primary-blue/5 px-4 py-6 transition-colors hover:border-primary-blue/40">
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                className="hidden"
                onChange={(e) => {
                  setTransferFile(e.target.files?.[0] ?? null);
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
                  <span className="text-sm font-medium text-primary-blue">{t.lecturesPage.chooseImage}</span>
                </>
              )}
              <span className="text-xs text-deep-navy/50">{t.lecturesPage.transferScreenshot}</span>
            </label>

            {purchaseError && <p className="mb-3 text-sm text-red-500">{purchaseError}</p>}

            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => {
                  setSelectedLecture(null);
                  setTransferFile(null);
                  setPurchaseError('');
                }}
              >
                {t.lecturesPage.cancel}
              </Button>
              <Button
                className="flex-1"
                onClick={submitPurchase}
                disabled={buyMutation.isPending || !transferFile}
              >
                <Upload className="h-4 w-4" />
                {buyMutation.isPending ? '...' : t.lecturesPage.submitPurchase}
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
}
