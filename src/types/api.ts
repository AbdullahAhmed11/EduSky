export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
}

export type UserRole = 'student' | 'parent';

export interface StudentStats {
  numberOfExams: number;
  numberOfPurchasedExams: number;
  currentPlan: unknown;
  totalPoints: number;
  level: number;
  successPercentage: number;
  failedPercentage: number;
}

export interface Student {
  id: string;
  name?: string;
  email?: string;
  phone?: string;
  phoneNumber?: string;
  country?: string;
  userType?: 'student';
  username?: string;
  image?: string | null;
  birthday?: string;
  studentCode: string;
  educationalStageId?: string;
  level: number;
  totalPoints: number;
  stats?: StudentStats;
  createdAt?: string;
  updatedAt?: string;
}

export interface Parent {
  id: string;
  name: string;
  phone: string;
  parentCode: string;
  userType: 'parent';
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthUser {
  role: UserRole;
  student?: Student;
  parent?: Parent;
}

export interface ExamQuestion {
  question: string;
  options: string[];
  correctAnswer?: number;
  points: number;
}

export interface Exam {
  id: string;
  title: string;
  description?: string;
  duration: number;
  totalPoints: number;
  isPaid?: boolean;
  price?: number;
  questions: ExamQuestion[];
  createdAt?: string;
  updatedAt?: string;
}

export type PurchaseStatus = 'pending' | 'approved' | 'rejected';

export interface ExamPurchase {
  id: string;
  studentId: string;
  examId: string;
  examTitle: string;
  studentName?: string;
  studentUsername?: string;
  status: PurchaseStatus;
  price: number;
  transferScreenshot?: string;
  rejectionReason?: string;
  requestedAt?: string;
  approvedAt?: string;
  rejectedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AnswerResult {
  questionIndex: number;
  selectedAnswer: number;
  isCorrect: boolean;
  pointsEarned: number;
  correctAnswer: number;
  question: string;
  options: string[];
  correctAnswerReason?: string;
}

export interface ExamResult {
  id: string;
  examId: string;
  studentId: string;
  totalScore: number;
  totalPoints: number;
  percentage: number;
  answers: AnswerResult[];
  submittedAt: string;
  createdAt?: string;
}

export interface ExamHistoryItem {
  id: string;
  examId: string;
  examTitle: string;
  examDescription?: string;
  totalScore: number;
  totalPoints: number;
  percentage: number;
  submittedAt: string;
  createdAt?: string;
}

export interface MistakeItem {
  id: string;
  examId: string;
  examTitle: string;
  examResultId: string;
  questionIndex: number;
  question: string;
  options: string[];
  selectedAnswer: number;
  correctAnswer: number;
  points: number;
  submittedAt: string;
  createdAt?: string;
}

export interface PointsHistoryItem {
  id: string;
  sourceType: string;
  sourceId: string;
  sourceTitle: string;
  points: number;
  levelBefore: number;
  levelAfter: number;
  leveledUp: boolean;
  earnedAt: string;
}

export interface EducationalStage {
  id: string;
  name: string;
  nameAr?: string;
  nameEn?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface EducationalMaterial {
  id: string;
  nameAr?: string;
  nameEn?: string;
}

export interface Lecture {
  id: string;
  name: string;
  description?: string;
  startAt: string;
  endAt: string;
  educationalMaterialId?: string;
  educationalMaterial?: EducationalMaterial;
  educationalStageId?: string;
  educationalStage?: EducationalStage;
  subMaterialId?: string;
  videoLink?: string;
  attachmentFile?: string;
  isPaid?: boolean;
  price?: number;
  hasAccess?: boolean;
  purchaseStatus?: PurchaseStatus;
  createdAt?: string;
  updatedAt?: string;
}

export interface LecturePurchase {
  id: string;
  lectureId: string;
  studentId: string;
  status?: PurchaseStatus;
  price?: number;
  transferScreenshot?: string;
  createdAt?: string;
}
