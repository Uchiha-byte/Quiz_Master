export type User = {
  id: string;
  username: string;
  email: string;
  password: string; // In a real app, would be hashed and never stored client-side
  createdAt: Date;
  quizzesTaken: string[];
  quizzesCreated: string[];
};

export type QuizOption = {
  id: string;
  text: string;
};

export type Question = {
  id: string;
  text: string;
  options: QuizOption[];
  correctOptionId: string;
};

export type Quiz = {
  id: string;
  title: string;
  description: string;
  creatorId: string;
  createdAt: Date;
  isPublic: boolean;
  questions: Question[];
};

export type QuizResult = {
  id: string;
  quizId: string;
  userId: string;
  score: number;
  totalQuestions: number;
  answers: { questionId: string, selectedOptionId: string }[];
  completedAt: Date;
};

export type AppState = {
  currentUser: User | null;
  quizzes: Quiz[];
  results: QuizResult[];
};

export type QuizAnswer = {
  questionId: string;
  selectedOptionId: string;
};