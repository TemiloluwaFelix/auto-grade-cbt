import { Question, Result, Exam } from '../types';

const STORAGE_KEYS = {
  QUESTIONS: 'cbt_questions',
  RESULTS: 'cbt_results',
  ACTIVE_EXAM: 'cbt_active_exam',
};

export const storage = {
  getQuestions: (): Question[] => {
    const data = localStorage.getItem(STORAGE_KEYS.QUESTIONS);
    return data ? JSON.parse(data) : [];
  },
  saveQuestions: (questions: Question[]) => {
    localStorage.setItem(STORAGE_KEYS.QUESTIONS, JSON.stringify(questions));
  },
  getResults: (): Result[] => {
    const data = localStorage.getItem(STORAGE_KEYS.RESULTS);
    return data ? JSON.parse(data) : [];
  },
  saveResult: (result: Result) => {
    const results = storage.getResults();
    localStorage.setItem(STORAGE_KEYS.RESULTS, JSON.stringify([...results, result]));
  },
  getActiveExam: (): Exam | null => {
    const data = localStorage.getItem(STORAGE_KEYS.ACTIVE_EXAM);
    return data ? JSON.parse(data) : null;
  },
  saveActiveExam: (exam: Exam | null) => {
    if (exam) {
      localStorage.setItem(STORAGE_KEYS.ACTIVE_EXAM, JSON.stringify(exam));
    } else {
      localStorage.removeItem(STORAGE_KEYS.ACTIVE_EXAM);
    }
  },
};

export const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};
