import type { Lecture, LecturePurchase } from '../types/api';
import { apiFetch } from './client';

export async function getLectures() {
  return apiFetch<Lecture[]>('/lectures');
}

export async function getMyAvailableLectures() {
  return apiFetch<Lecture[]>('/lectures/my-available');
}

export async function getStudentLectures(studentId: string) {
  return apiFetch<Lecture[]>(`/students/${studentId}/lectures`);
}

export async function getStudentFreeLectures(studentId: string) {
  return apiFetch<Lecture[]>(`/students/${studentId}/lectures/free`);
}

export async function getStudentPaidLectures(studentId: string) {
  return apiFetch<Lecture[]>(`/students/${studentId}/lectures/paid`);
}

export async function getLecture(id: string) {
  return apiFetch<Lecture>(`/lectures/${id}`);
}

export async function buyLecture(
  lectureId: string,
  studentId: string,
  transferScreenshot: File,
) {
  const form = new FormData();
  form.append('lectureId', lectureId);
  form.append('studentId', studentId);
  form.append('transferScreenshot', transferScreenshot);

  return apiFetch<LecturePurchase>('/lecture-purchases/buy', {
    method: 'POST',
    body: form,
  });
}
