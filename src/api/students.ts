import type {
  EducationalStage,
  ExamHistoryItem,
  MistakeItem,
  PointsHistoryItem,
  Student,
} from '../types/api';
import { apiFetch } from './client';

export async function getEducationalStages() {
  return apiFetch<EducationalStage[]>('/educational-stages', {}, false);
}

export async function getStudentExams(studentId: string) {
  return apiFetch<ExamHistoryItem[]>(`/students/${studentId}/exams`);
}

export async function getStudentMistakes(studentId: string) {
  return apiFetch<MistakeItem[]>(`/students/${studentId}/mistakes`);
}

export async function getStudentPointsHistory(studentId: string) {
  return apiFetch<PointsHistoryItem[]>(`/students/${studentId}/points-history`);
}

export async function getStudent(id: string) {
  return apiFetch<Student>(`/students/${id}`);
}
