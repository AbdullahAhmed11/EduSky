export interface SubjectItem {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  lectures: string;
  exams: string;
  students: string;
  duration: string;
  topics: string[];
  cta: string;
  badge: string;
}

export interface TranslationKeys {
  nav: {
    exams: string;
    lectures: string;
    progress: string;
    subjects: string;
    teachers: string;
    login: string;
    getStarted: string;
    dashboard: string;
    purchases: string;
    logout: string;
  };
  hero: {
    tagline: string;
    titleBefore: string;
    titleHighlight: string;
    titleAfter: string;
    description: string;
    ctaPrimary: string;
    ctaSecondary: string;
    features: {
      exams: string;
      lectures: string;
      progress: string;
    };
    stats: {
      examsPassed: string;
      liveLectures: string;
    };
    imageAlt: string;
  };
  subjects: {
    badge: string;
    title: string;
    titleHighlight: string;
    description: string;
    viewAll: string;
    stats: {
      lectures: string;
      exams: string;
      students: string;
      duration: string;
    };
    topicsLabel: string;
    items: {
      arabic: SubjectItem;
    };
  };
  teachers: {
    badge: string;
    title: string;
    titleHighlight: string;
    description: string;
    viewAll: string;
    stats: {
      experience: string;
      students: string;
      lectures: string;
      rating: string;
    };
    cta: string;
    items: {
      ashraf: TeacherItem;
    };
  };
  footer: {
    ctaBadge: string;
    ctaTitle: string;
    ctaButton: string;
    companyName: string;
    description: string;
    platformTitle: string;
    companyTitle: string;
    contactTitle: string;
    about: string;
    careers: string;
    privacy: string;
    terms: string;
    copyright: string;
    madeWith: string;
    byTeam: string;
    contact: {
      email: string;
      phone: string;
      address: string;
    };
  };
  auth: {
    brandTagline: string;
    loginTitle: string;
    studentTab: string;
    parentTab: string;
    studentCode: string;
    parentCode: string;
    password: string;
    loginButton: string;
    noAccount: string;
    registerStudent: string;
    registerParent: string;
    logout: string;
    registerStudentTitle: string;
    registerParentTitle: string;
    username: string;
    phone: string;
    birthday: string;
    educationalStage: string;
    name: string;
    studentCodeRef: string;
    coupon: string;
    registerButton: string;
    haveAccount: string;
    goLogin: string;
    successTitle: string;
    yourCode: string;
    goToLogin: string;
    errorGeneric: string;
  };
  dashboard: {
    badge: string;
    title: string;
    welcome: string;
    tabs: {
      overview: string;
      lectures: string;
    };
    stats: {
      examsTaken: string;
      purchased: string;
      successRate: string;
      level: string;
      points: string;
    };
    quickActions: string;
    browseExams: string;
    viewProgress: string;
    recentExams: string;
    pendingPurchases: string;
    noRecent: string;
  };
  lecturesPage: {
    tabs: {
      all: string;
      free: string;
      paid: string;
      browse: string;
    };
    free: string;
    paid: string;
    pending: string;
    material: string;
    stage: string;
    watch: string;
    buyLecture: string;
    awaitingApproval: string;
    noLectures: string;
    purchaseModalTitle: string;
    transferScreenshot: string;
    transferHint: string;
    chooseImage: string;
    transferRequired: string;
    submitPurchase: string;
    cancel: string;
    viewDetails: string;
    description: string;
    schedule: string;
    hasAccess: string;
    lockedPreview: string;
    openVideo: string;
    externalVideo: string;
    watchExternal: string;
    unsupportedVideo: string;
    downloadAttachment: string;
    back: string;
  };
  examsPage: {
    badge: string;
    title: string;
    highlight: string;
    description: string;
    free: string;
    paid: string;
    locked: string;
    pending: string;
    ready: string;
    minutes: string;
    points: string;
    viewDetails: string;
    noExams: string;
    requestPurchase: string;
    startExam: string;
    awaitingApproval: string;
    questions: string;
    confirmSubmit: string;
    submitExam: string;
    timeLeft: string;
    questionOf: string;
    back: string;
    resultTitle: string;
    score: string;
    correct: string;
    wrong: string;
    reviewMistakes: string;
    backDashboard: string;
    browseMore: string;
    purchaseModalTitle: string;
    transferScreenshot: string;
    transferHint: string;
    chooseImage: string;
    transferRequired: string;
    submitPurchase: string;
    cancel: string;
    purchaseSuccess: string;
  };
  purchases: {
    badge: string;
    title: string;
    description: string;
    status: { pending: string; approved: string; rejected: string };
    noPurchases: string;
    price: string;
    requestedAt: string;
    transferScreenshot: string;
  };
  progressPage: {
    badge: string;
    title: string;
    tabs: { history: string; mistakes: string; points: string };
    noHistory: string;
    noMistakes: string;
    noPoints: string;
    level: string;
    leveledUp: string;
  };
  parent: {
    badge: string;
    title: string;
    childProfile: string;
    studentCode: string;
    level: string;
    points: string;
    examHistory: string;
    mistakes: string;
    noAccess: string;
    noHistory: string;
  };
}

export interface TeacherItem {
  id: string;
  name: string;
  role: string;
  subject: string;
  bio: string;
  experience: string;
  students: string;
  lectures: string;
  rating: string;
  imageAlt: string;
  badge: string;
  highlights: string[];
}

export const en: TranslationKeys = {
  nav: {
    exams: 'Exams',
    lectures: 'Lectures',
    progress: 'Progress',
    subjects: 'Subjects',
    teachers: 'Teachers',
    login: 'Log In',
    getStarted: 'Get Started',
    dashboard: 'Dashboard',
    purchases: 'Purchases',
    logout: 'Log Out',
  },
  hero: {
    tagline: 'Empowering Education Beyond Limits',
    titleBefore: 'Master Your Exams &',
    titleHighlight: 'Lectures',
    titleAfter: 'with EduSky',
    description:
      'The all-in-one platform for interactive lectures, smart exam testing, and real-time progress tracking — built to help you learn smarter and achieve more.',
    ctaPrimary: 'Start Learning Free',
    ctaSecondary: 'Browse Lectures',
    features: {
      exams: 'Smart Exams',
      lectures: 'Live Lectures',
      progress: 'Track Progress',
    },
    stats: {
      examsPassed: 'Exams Passed',
      liveLectures: 'Live Lectures',
    },
    imageAlt: 'EduSky platform — exams and lectures on laptop and mobile',
  },
  subjects: {
    badge: 'Curriculum',
    title: 'Explore Our',
    titleHighlight: 'Subjects',
    description:
      'Comprehensive courses designed for the General Secondary Certificate — with lectures, practice exams, and full progress tracking.',
    viewAll: 'View All Subjects',
    stats: {
      lectures: 'Lectures',
      exams: 'Practice Exams',
      students: 'Students',
      duration: 'Total Hours',
    },
    topicsLabel: 'What you will learn',
    items: {
      arabic: {
        id: 'arabic',
        title: 'Arabic Language',
        subtitle: 'General Secondary Certificate',
        description:
          'Master grammar, rhetoric, literature, and reading comprehension with structured lessons and exam-style practice aligned with the official curriculum.',
        lectures: '48',
        exams: '24',
        students: '3.2K',
        duration: '36h',
        topics: ['Grammar & Morphology', 'Rhetoric & Prosody', 'Literary Analysis', 'Reading Comprehension'],
        cta: 'Start Arabic Course',
        badge: 'Most Popular',
      },
    },
  },
  teachers: {
    badge: 'Our Faculty',
    title: 'Meet Our',
    titleHighlight: 'Teachers',
    description:
      'Learn from experienced educators who bring passion, clarity, and proven results to every lecture and exam session.',
    viewAll: 'View All Teachers',
    stats: {
      experience: 'Experience',
      students: 'Students',
      lectures: 'Lectures',
      rating: 'Rating',
    },
    cta: 'View Arabic Course',
    items: {
      ashraf: {
        id: 'ashraf',
        name: 'Mr. Ashraf Selim',
        role: 'Arabic Language Professor',
        subject: 'Arabic Language — General Secondary',
        bio: 'A dedicated Arabic educator with a passion for making grammar, rhetoric, and literature accessible. Mr. Ashraf helps students build confidence and excel in their secondary certificate exams.',
        experience: '15+',
        students: '5K+',
        lectures: '120+',
        rating: '4.9',
        imageAlt: 'Mr. Ashraf Selim — Arabic Language Professor at EduSky',
        badge: 'Lead Instructor',
        highlights: ['Grammar Expert', 'Exam Specialist', 'Student Favorite'],
      },
    },
  },
  footer: {
    ctaBadge: 'Ready to learn?',
    ctaTitle: 'Start your journey with EduSky today',
    ctaButton: 'Get Started Free',
    companyName: 'EduSky System Company',
    description:
      'An integrated educational platform for lectures, exams, and progress tracking — empowering students to learn smarter and achieve more.',
    platformTitle: 'Platform',
    companyTitle: 'Company',
    contactTitle: 'Contact Us',
    about: 'About Us',
    careers: 'Careers',
    privacy: 'Privacy Policy',
    terms: 'Terms of Service',
    copyright: 'EduSky System Company. All rights reserved.',
    madeWith: 'Made with',
    byTeam: 'by EduSky Team',
    contact: {
      email: 'info@edusky.com',
      phone: '+20 100 000 0000',
      address: 'Cairo, Egypt',
    },
  },
  auth: {
    brandTagline: 'Empowering Education Beyond Limits — your path to exam success.',
    loginTitle: 'Welcome Back',
    studentTab: 'Student',
    parentTab: 'Parent',
    studentCode: 'Student Code',
    parentCode: 'Parent Code',
    password: 'Password',
    loginButton: 'Sign In',
    noAccount: "Don't have an account?",
    registerStudent: 'Register as Student',
    registerParent: 'Register as Parent',
    logout: 'Log Out',
    registerStudentTitle: 'Create Student Account',
    registerParentTitle: 'Create Parent Account',
    username: 'Username',
    phone: 'Phone Number',
    birthday: 'Birthday',
    educationalStage: 'Educational Stage',
    name: 'Full Name',
    studentCodeRef: "Child's Student Code",
    coupon: 'Referral Code (optional)',
    registerButton: 'Register',
    haveAccount: 'Already have an account?',
    goLogin: 'Sign In',
    successTitle: 'Registration Successful!',
    yourCode: 'Your code is',
    goToLogin: 'Go to Login',
    errorGeneric: 'Something went wrong. Please try again.',
  },
  dashboard: {
    badge: 'Dashboard',
    title: 'Welcome back,',
    welcome: 'Track your learning journey',
    tabs: {
      overview: 'Overview',
      lectures: 'Lectures',
    },
    stats: {
      examsTaken: 'Exams Taken',
      purchased: 'Purchased',
      successRate: 'Success Rate',
      level: 'Level',
      points: 'Points',
    },
    quickActions: 'Quick Actions',
    browseExams: 'Browse Exams',
    viewProgress: 'View Progress',
    recentExams: 'Recent Results',
    pendingPurchases: 'Pending Purchases',
    noRecent: 'No exam results yet',
  },
  lecturesPage: {
    tabs: {
      all: 'My Lectures',
      free: 'Free',
      paid: 'Paid',
      browse: 'Browse All',
    },
    free: 'Free',
    paid: 'Paid',
    pending: 'Pending',
    material: 'Subject',
    stage: 'Stage',
    watch: 'Watch Lecture',
    buyLecture: 'Buy Lecture',
    awaitingApproval: 'Awaiting Approval',
    noLectures: 'No lectures available yet',
    purchaseModalTitle: 'Purchase Lecture',
    transferScreenshot: 'Transfer screenshot',
    transferHint: 'Upload a screenshot of your payment transfer to complete the purchase request.',
    chooseImage: 'Choose image',
    transferRequired: 'Please upload a transfer screenshot',
    submitPurchase: 'Submit Purchase',
    cancel: 'Cancel',
    viewDetails: 'Details',
    description: 'Description',
    schedule: 'Schedule',
    hasAccess: 'Unlocked',
    lockedPreview: 'Purchase this lecture to unlock the video and materials.',
    openVideo: 'Open Video',
    externalVideo: 'The lecture opens on an external platform in a new tab.',
    watchExternal: 'Watch outside EduSky',
    unsupportedVideo: 'This video format cannot be played inline.',
    downloadAttachment: 'Download Attachment',
    back: 'Back to Dashboard',
  },
  examsPage: {
    badge: 'Exams',
    title: 'Browse',
    highlight: 'Exams',
    description: 'Find and take practice exams for your subjects',
    free: 'Free',
    paid: 'Paid',
    locked: 'Locked',
    pending: 'Pending',
    ready: 'Ready',
    minutes: 'min',
    points: 'pts',
    viewDetails: 'View Details',
    noExams: 'No exams available',
    requestPurchase: 'Request Purchase',
    startExam: 'Start Exam',
    awaitingApproval: 'Awaiting Approval',
    questions: 'questions',
    confirmSubmit: 'Are you sure you want to submit?',
    submitExam: 'Submit Exam',
    timeLeft: 'Time Left',
    questionOf: 'Question',
    back: 'Back',
    resultTitle: 'Exam Results',
    score: 'Score',
    correct: 'Correct',
    wrong: 'Wrong',
    reviewMistakes: 'Review Mistakes',
    backDashboard: 'Back to Dashboard',
    browseMore: 'Browse More Exams',
    purchaseModalTitle: 'Request Exam Purchase',
    transferScreenshot: 'Transfer Screenshot',
    transferHint: 'Upload a screenshot of your payment transfer as proof.',
    chooseImage: 'Choose image',
    transferRequired: 'Transfer screenshot is required',
    submitPurchase: 'Submit Request',
    cancel: 'Cancel',
    purchaseSuccess: 'Purchase request submitted successfully',
  },
  purchases: {
    badge: 'Purchases',
    title: 'My Purchases',
    description: 'Track your exam purchase requests',
    status: { pending: 'Pending', approved: 'Approved', rejected: 'Rejected' },
    noPurchases: 'No purchase requests yet',
    price: 'Price',
    requestedAt: 'Requested',
    transferScreenshot: 'Transfer proof',
  },
  progressPage: {
    badge: 'Progress',
    title: 'Your Progress',
    tabs: { history: 'Exam History', mistakes: 'Mistakes', points: 'Points' },
    noHistory: 'No exam history yet',
    noMistakes: 'No mistakes to review',
    noPoints: 'No points history yet',
    level: 'Level',
    leveledUp: 'Leveled up!',
  },
  parent: {
    badge: 'Parent Portal',
    title: "Your Child's Progress",
    childProfile: 'Child Profile',
    studentCode: 'Student Code',
    level: 'Level',
    points: 'Points',
    examHistory: 'Exam History',
    mistakes: 'Mistakes',
    noAccess: 'Unable to load detailed progress',
    noHistory: 'No exam history available',
  },
};
