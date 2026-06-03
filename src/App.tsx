import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from './i18n/LanguageContext';
import PublicLayout from './layouts/PublicLayout';
import AuthLayout from './layouts/AuthLayout';
import AppLayout from './layouts/AppLayout';
import { ProtectedRoute } from './routes/ProtectedRoute';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterStudentPage from './pages/auth/RegisterStudentPage';
import RegisterParentPage from './pages/auth/RegisterParentPage';
import DashboardPage from './pages/student/DashboardPage';
import ExamsPage from './pages/student/ExamsPage';
import ExamDetailPage from './pages/student/ExamDetailPage';
import TakeExamPage from './pages/student/TakeExamPage';
import ExamResultPage from './pages/student/ExamResultPage';
import PurchasesPage from './pages/student/PurchasesPage';
import ProgressPage from './pages/student/ProgressPage';
import ParentDashboardPage from './pages/parent/ParentDashboardPage';

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, staleTime: 30_000 } },
});

function AppRoutes() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route index element={<LandingPage />} />
      </Route>

      <Route element={<AuthLayout />}>
        <Route path="login" element={<LoginPage />} />
        <Route path="register/student" element={<RegisterStudentPage />} />
        <Route path="register/parent" element={<RegisterParentPage />} />
      </Route>

      <Route element={<ProtectedRoute role="student" />}>
        <Route element={<AppLayout />}>
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="exams" element={<ExamsPage />} />
          <Route path="exams/:id" element={<ExamDetailPage />} />
          <Route path="exams/:id/take" element={<TakeExamPage />} />
          <Route path="exams/:id/result" element={<ExamResultPage />} />
          <Route path="purchases" element={<PurchasesPage />} />
          <Route path="progress" element={<ProgressPage />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute role="parent" />}>
        <Route element={<AppLayout />}>
          <Route path="parent/dashboard" element={<ParentDashboardPage />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <AuthProvider>
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </AuthProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
}
