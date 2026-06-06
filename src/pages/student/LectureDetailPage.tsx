import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
  Calendar,
  Download,
  ImagePlus,
  Lock,
  Upload,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { buyLecture, getLecture, getMyAvailableLectures } from '../../api/lectures';
import { ApiError } from '../../api/client';
import { Badge, Button, Card, LoadingSpinner, PageHeader } from '../../components/ui';
import { getStudentId, useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../i18n/LanguageContext';
import type { PurchaseStatus } from '../../types/api';
import { getUploadUrl } from '../../utils/mediaUrl';
import { formatDateRange, localizedName } from '../../utils/text';
import { getInlineVideoSrc } from '../../utils/videoEmbed';

function purchaseBadgeVariant(status?: PurchaseStatus) {
  if (status === 'approved') return 'success' as const;
  if (status === 'rejected') return 'error' as const;
  return 'warning' as const;
}

export default function LectureDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { t, language } = useLanguage();
  const { user } = useAuth();
  const studentId = getStudentId(user);
  const qc = useQueryClient();
  const locale = language === 'ar' ? 'ar-EG' : 'en-US';

  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [transferFile, setTransferFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [purchaseError, setPurchaseError] = useState('');

  const { data: lecture, isLoading } = useQuery({
    queryKey: ['lecture', id],
    queryFn: () => getLecture(id!),
    enabled: !!id,
  });

  const { data: availableLectures = [] } = useQuery({
    queryKey: ['lectures-my-available'],
    queryFn: getMyAvailableLectures,
  });

  const availableEntry = useMemo(
    () => availableLectures.find((item) => item.id === id),
    [availableLectures, id],
  );

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
      if (!studentId || !id) throw new Error('Missing data');
      return buyLecture(id, studentId, file);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['lecture', id] });
      qc.invalidateQueries({ queryKey: ['lectures-my-available'] });
      qc.invalidateQueries({ queryKey: ['lectures'] });
      setShowPurchaseModal(false);
      setTransferFile(null);
      setPurchaseError('');
    },
    onError: (err) => {
      setPurchaseError(err instanceof ApiError ? err.message : t.auth.errorGeneric);
    },
  });

  if (isLoading || !lecture) return <LoadingSpinner />;

  const hasAccess =
    availableEntry?.hasAccess ??
    lecture.hasAccess ??
    (!lecture.isPaid && !!lecture.videoLink);

  const purchaseStatus = availableEntry?.purchaseStatus ?? lecture.purchaseStatus;
  const material = localizedName(lecture.educationalMaterial, language);
  const stage = localizedName(lecture.educationalStage, language);
  const attachmentUrl = getUploadUrl(lecture.attachmentFile);
  const videoSource = lecture.videoLink ? getInlineVideoSrc(lecture.videoLink) : null;

  const purchaseStatusLabel =
    purchaseStatus === 'approved'
      ? t.purchases.status.approved
      : purchaseStatus === 'rejected'
        ? t.purchases.status.rejected
        : purchaseStatus === 'pending'
          ? t.purchases.status.pending
          : null;

  const handleSubmitPurchase = () => {
    if (!transferFile) {
      setPurchaseError(t.lecturesPage.transferRequired);
      return;
    }
    purchaseMutation.mutate(transferFile);
  };

  return (
    <div>
      <PageHeader title={lecture.name} description={material || stage ? `${material}${material && stage ? ' · ' : ''}${stage}` : undefined} />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card className="overflow-hidden p-0">
            {hasAccess && lecture.videoLink ? (
              videoSource ? (
                <div className="relative aspect-video w-full bg-deep-navy">
                  {videoSource.type === 'embed' ? (
                    <iframe
                      src={videoSource.src}
                      title={lecture.name}
                      className="absolute inset-0 h-full w-full border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    />
                  ) : (
                    <video
                      src={videoSource.src}
                      controls
                      controlsList="nodownload"
                      className="absolute inset-0 h-full w-full"
                    />
                  )}
                </div>
              ) : (
                <div className="flex aspect-video flex-col items-center justify-center gap-3 bg-deep-navy/5 px-6 text-center">
                  <p className="text-sm text-deep-navy/70">{t.lecturesPage.unsupportedVideo}</p>
                </div>
              )
            ) : (
              <div className="flex aspect-video flex-col items-center justify-center gap-3 bg-deep-navy/5 px-6 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-warm-orange/10">
                  <Lock className="h-8 w-8 text-warm-orange" />
                </div>
                <p className="max-w-sm text-sm text-deep-navy/70">{t.lecturesPage.lockedPreview}</p>
                {lecture.isPaid && lecture.price != null && (
                  <p className="text-lg font-bold text-warm-orange">{lecture.price} EGP</p>
                )}
              </div>
            )}

            {lecture.description && (
              <div className="border-t border-deep-navy/8 p-6">
                <h2 className="mb-3 text-lg font-semibold text-deep-navy">{t.lecturesPage.description}</h2>
                <div
                  className="prose prose-sm max-w-none text-deep-navy/80 prose-p:leading-relaxed prose-a:text-primary-blue"
                  dangerouslySetInnerHTML={{ __html: lecture.description }}
                />
              </div>
            )}
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <div className="mb-4 flex flex-wrap gap-2">
              <Badge variant={lecture.isPaid ? 'warning' : 'success'}>
                {lecture.isPaid ? t.lecturesPage.paid : t.lecturesPage.free}
              </Badge>
              {hasAccess && <Badge variant="success">{t.lecturesPage.hasAccess}</Badge>}
              {purchaseStatusLabel && (
                <Badge variant={purchaseBadgeVariant(purchaseStatus)}>{purchaseStatusLabel}</Badge>
              )}
            </div>

            <dl className="space-y-3 text-sm">
              {material && (
                <div>
                  <dt className="text-deep-navy/50">{t.lecturesPage.material}</dt>
                  <dd className="font-medium text-deep-navy">{material}</dd>
                </div>
              )}
              {stage && (
                <div>
                  <dt className="text-deep-navy/50">{t.lecturesPage.stage}</dt>
                  <dd className="font-medium text-deep-navy">{stage}</dd>
                </div>
              )}
              <div>
                <dt className="mb-1 flex items-center gap-1 text-deep-navy/50">
                  <Calendar className="h-3.5 w-3.5" />
                  {t.lecturesPage.schedule}
                </dt>
                <dd className="font-medium text-deep-navy">
                  {formatDateRange(lecture.startAt, lecture.endAt, locale)}
                </dd>
              </div>
              {lecture.isPaid && lecture.price != null && (
                <div>
                  <dt className="text-deep-navy/50">{t.purchases.price}</dt>
                  <dd className="text-lg font-bold text-warm-orange">{lecture.price} EGP</dd>
                </div>
              )}
            </dl>

            {hasAccess && attachmentUrl && (
              <a
                href={attachmentUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-primary-blue/20 bg-primary-blue/5 px-4 py-2.5 text-sm font-semibold text-primary-blue hover:bg-primary-blue/10"
              >
                <Download className="h-4 w-4" />
                {t.lecturesPage.downloadAttachment}
              </a>
            )}
          </Card>

          <div className="flex flex-col gap-3">
            {!hasAccess && lecture.isPaid && purchaseStatus !== 'pending' && (
              <Button
                onClick={() => {
                  setPurchaseError('');
                  setTransferFile(null);
                  setShowPurchaseModal(true);
                }}
                disabled={purchaseMutation.isPending}
              >
                {t.lecturesPage.buyLecture}
              </Button>
            )}
            {purchaseStatus === 'pending' && (
              <Button disabled>{t.lecturesPage.awaitingApproval}</Button>
            )}
            <Link to="/dashboard">
              <Button variant="outline" className="w-full">{t.lecturesPage.back}</Button>
            </Link>
          </div>
        </div>
      </div>

      {showPurchaseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-deep-navy/40 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
          >
            <h3 className="mb-2 text-xl font-bold text-deep-navy">{t.lecturesPage.purchaseModalTitle}</h3>
            <p className="mb-1 text-sm text-deep-navy/60">{lecture.name}</p>
            {lecture.price != null && (
              <p className="mb-4 text-lg font-semibold text-warm-orange">{lecture.price} EGP</p>
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
                  setShowPurchaseModal(false);
                  setTransferFile(null);
                  setPurchaseError('');
                }}
              >
                {t.lecturesPage.cancel}
              </Button>
              <Button
                className="flex-1"
                onClick={handleSubmitPurchase}
                disabled={purchaseMutation.isPending || !transferFile}
              >
                <Upload className="h-4 w-4" />
                {purchaseMutation.isPending ? '...' : t.lecturesPage.submitPurchase}
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
