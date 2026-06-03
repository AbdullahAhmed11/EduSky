import type { Exam, ExamPurchase, ExamResult } from '../types/api';
import { apiFetch } from './client';

export async function getExams(params?: {
  educationalMaterialId?: string;
  subMaterialId?: string;
}) {
  const qs = new URLSearchParams();
  if (params?.educationalMaterialId) qs.set('educationalMaterialId', params.educationalMaterialId);
  if (params?.subMaterialId) qs.set('subMaterialId', params.subMaterialId);
  const query = qs.toString();
  return apiFetch<Exam[]>(`/exams${query ? `?${query}` : ''}`);
}

export async function getExam(id: string) {
  return apiFetch<Exam>(`/exams/${id}`);
}

export async function solveExam(id: string, answers: number[]) {
  return apiFetch<{ result: ExamResult }>(`/exams/${id}/solve`, {
    method: 'POST',
    body: JSON.stringify({ answers }),
  });
}

export async function buyExam(examId: string, studentId: string, transferScreenshot: File) {
  const form = new FormData();
  form.append('examId', examId);
  form.append('studentId', studentId);
  form.append('transferScreenshot', transferScreenshot);

  return apiFetch<ExamPurchase>('/exam-purchases/buy', {
    method: 'POST',
    body: form,
  });
}

export async function getMyPurchases() {
  return apiFetch<ExamPurchase[]>('/exam-purchases/my-purchases');
}
