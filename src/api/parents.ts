import type { Student } from '../types/api';
import { apiFetch } from './client';

export async function getLinkedStudent() {
  return apiFetch<Student>('/parents/student');
}
