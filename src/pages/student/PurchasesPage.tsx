import { motion } from 'framer-motion';
import { usePurchases } from '../../hooks/usePurchases';
import { Badge, Card, LoadingSpinner, PageHeader } from '../../components/ui';
import { useLanguage } from '../../i18n/LanguageContext';
import { purchaseStatusVariant } from '../../utils/examAccess';
import { getUploadUrl } from '../../utils/mediaUrl';

export default function PurchasesPage() {
  const { t } = useLanguage();
  const { data: purchases = [], isLoading } = usePurchases();

  return (
    <div>
      <PageHeader badge={t.purchases.badge} title={t.purchases.title} description={t.purchases.description} />

      {isLoading ? (
        <LoadingSpinner />
      ) : purchases.length === 0 ? (
        <p className="text-center text-deep-navy/50">{t.purchases.noPurchases}</p>
      ) : (
        <div className="space-y-4">
          {purchases.map((p, i) => {
            const screenshotUrl = getUploadUrl(p.transferScreenshot);
            return (
              <motion.div key={p.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <Card className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex-1">
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <h3 className="font-semibold text-deep-navy">{p.examTitle}</h3>
                      <Badge variant={purchaseStatusVariant(p.status)}>{t.purchases.status[p.status]}</Badge>
                    </div>
                    <p className="text-sm text-deep-navy/55">
                      {t.purchases.price}: {p.price} EGP · {t.purchases.requestedAt}:{' '}
                      {new Date(p.requestedAt ?? p.createdAt ?? '').toLocaleDateString()}
                    </p>
                    {p.rejectionReason && <p className="mt-1 text-sm text-red-500">{p.rejectionReason}</p>}
                    {screenshotUrl && (
                      <div className="mt-3">
                        <p className="mb-2 text-xs font-medium text-deep-navy/60">{t.purchases.transferScreenshot}</p>
                        <a href={screenshotUrl} target="_blank" rel="noopener noreferrer">
                          <img
                            src={screenshotUrl}
                            alt={t.purchases.transferScreenshot}
                            className="max-h-32 rounded-lg border border-primary-blue/15 object-contain"
                          />
                        </a>
                      </div>
                    )}
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
