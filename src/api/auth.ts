import type { Parent, Student } from '../types/api';
import { apiFetch } from './client';

interface StudentLoginResponse {
  student: Student;
  token: string;
}

interface ParentLoginResponse {
  parent: Parent;
  token: string;
}

interface ParentRegisterResponse {
  parent: Parent;
  student: { id: string; name: string; username: string; studentCode: string };
  token: string;
}

interface StudentRegisterResponse {
  student: Student;
}

export async function studentLogin(code: string, password: string) {
  return apiFetch<StudentLoginResponse>(
    '/users/student/login',
    { method: 'POST', body: JSON.stringify({ code, password }) },
    false,
  );
}

export async function parentLogin(code: string, password: string) {
  return apiFetch<ParentLoginResponse>(
    '/parents/login',
    { method: 'POST', body: JSON.stringify({ code, password }) },
    false,
  );
}

export async function registerStudent(data: {
  username: string;
  phoneNumber: string;
  birthday: string;
  educationalStageId: string;
  password: string;
  email?: string;
  coupon?: string;
}) {
  return apiFetch<StudentRegisterResponse>(
    '/students/register',
    { method: 'POST', body: JSON.stringify(data) },
    false,
  );
}

export async function registerParent(data: {
  name: string;
  phone: string;
  studentCode: string;
  password: string;
}) {
  return apiFetch<ParentRegisterResponse>(
    '/parents/register',
    { method: 'POST', body: JSON.stringify(data) },
    false,
  );
}
