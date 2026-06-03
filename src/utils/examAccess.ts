import type { Exam, ExamPurchase, PurchaseStatus } from '../types/api';

export type ExamAccessStatus = 'free' | 'locked' | 'pending' | 'ready';

export function getExamAccess(
  exam: Exam,
  purchases: ExamPurchase[],
): ExamAccessStatus {
  if (!exam.isPaid) return 'free';
  const purchase = purchases.find((p) => p.examId === exam.id);
  if (!purchase) return 'locked';
  if (purchase.status === 'approved') return 'ready';
  if (purchase.status === 'pending') return 'pending';
  return 'locked';
}

export function purchaseStatusVariant(status: PurchaseStatus) {
  if (status === 'approved') return 'success' as const;
  if (status === 'pending') return 'warning' as const;
  return 'error' as const;
}
