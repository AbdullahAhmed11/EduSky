import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import * as authApi from '../api/auth';
import type { AuthUser, Parent, Student, UserRole } from '../types/api';

const TOKEN_KEY = 'edusky-token';
const AUTH_KEY = 'edusky-auth';

interface StoredAuth {
  role: UserRole;
  student?: Student;
  parent?: Parent;
}

interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  loginStudent: (code: string, password: string) => Promise<Student>;
  loginParent: (code: string, password: string) => Promise<Parent>;
  setSession: (role: UserRole, token: string, student?: Student, parent?: Parent) => void;
  logout: () => void;
  updateStudent: (student: Student) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function loadStoredAuth(): AuthUser | null {
  const token = localStorage.getItem(TOKEN_KEY);
  const raw = localStorage.getItem(AUTH_KEY);
  if (!token || !raw) return null;
  try {
    const parsed = JSON.parse(raw) as StoredAuth;
    return parsed.role === 'student'
      ? { role: 'student', student: parsed.student }
      : { role: 'parent', parent: parsed.parent };
  } catch {
    return null;
  }
}

function persistAuth(role: UserRole, student?: Student, parent?: Parent, token?: string) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(AUTH_KEY, JSON.stringify({ role, student, parent }));
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(loadStoredAuth);

  const loginStudent = useCallback(async (code: string, password: string) => {
    const { student, token } = await authApi.studentLogin(code, password);
    persistAuth('student', student, undefined, token);
    setUser({ role: 'student', student });
    return student;
  }, []);

  const loginParent = useCallback(async (code: string, password: string) => {
    const { parent, token } = await authApi.parentLogin(code, password);
    persistAuth('parent', undefined, parent, token);
    setUser({ role: 'parent', parent });
    return parent;
  }, []);

  const setSession = useCallback((role: UserRole, token: string, student?: Student, parent?: Parent) => {
    persistAuth(role, student, parent, token);
    setUser(role === 'student' ? { role, student } : { role, parent });
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(AUTH_KEY);
    setUser(null);
  }, []);

  const updateStudent = useCallback((student: Student) => {
    setUser({ role: 'student', student });
    persistAuth('student', student);
  }, []);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      loginStudent,
      loginParent,
      setSession,
      logout,
      updateStudent,
    }),
    [user, loginStudent, loginParent, setSession, logout, updateStudent],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

export function getStudentId(user: AuthUser | null): string | null {
  return user?.role === 'student' ? user.student?.id ?? null : null;
}
