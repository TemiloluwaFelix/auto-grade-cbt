export type ClassLevel = 'JS 1' | 'JS 2' | 'JS 3' | 'SS 1' | 'SS 2' | 'SS 3';

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctOptionIndex: number;
  subject: string;
  classLevel: ClassLevel;
}

export interface Exam {
  id: string;
  studentName: string;
  studentId: string;
  classLevel: ClassLevel;
  subject: string;
  questions: Question[];
  startTime: number;
  durationMinutes: number;
  endTime?: number;
  answers: Record<string, number>; // questionId -> optionIndex
  score?: number;
  status: 'ongoing' | 'completed';
}

export interface Result {
  id: string;
  studentName: string;
  studentId: string;
  classLevel: ClassLevel;
  subject: string;
  score: number;
  totalQuestions: number;
  date: string;
}

export interface User {
  id: string;
  name: string;
  role: 'admin' | 'student';
  classLevel?: ClassLevel;
}
