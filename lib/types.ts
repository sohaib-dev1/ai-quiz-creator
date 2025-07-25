export interface Question {
  id: number
  text: string
  options: string[]
}

export interface Quiz {
  quizId: string
  topic: string
  questions: Question[]
}

export interface QuizWithAnswers extends Quiz {
  correctAnswers: Record<string, string>
  userId?: string | null
  createdAt: Date
}

export interface QuizResult {
  quizId: string
  userId?: string | null
  userAnswers: Record<string, string>
  score: number
  completedAt: Date
}

export interface QuizFeedback {
  id: number
  yourAnswer: string
  correctAnswer: string
}

export interface UserQuizHistory {
  quizId: string
  topic: string
  score: number
  totalQuestions: number
  percentage: number
  completedAt: Date
}

export interface AuthUser {
  userId: string;
  email: string;
  name: string;
}

export interface User extends AuthUser {
  _id?: string;
  createdAt: Date;
}

export interface AIQuizRequest {
  topic: string
}

export interface AIQuizResponse {
  questions: Question[]
  answers: Record<string, string>
}
