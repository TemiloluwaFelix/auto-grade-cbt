import React, { useState, useEffect } from 'react';
import { Toaster } from 'sonner';
import { User, Exam, Result, Question } from './types';
import { storage } from './lib/storage';
import { Login } from './components/Login';
import { Button } from './components/ui/button';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { StudentExamSelector } from './components/student/StudentExamSelector';
import { ExamEngine } from './components/student/ExamEngine';
import { ExamResultSummary } from './components/student/ExamResultSummary';

const DEFAULT_QUESTIONS: Question[] = [
  {
    id: '1',
    text: 'What is the capital of Nigeria?',
    options: ['Lagos', 'Abuja', 'Kano', 'Ibadan'],
    correctOptionIndex: 1,
    subject: 'General Studies',
    classLevel: 'JS 1',
  },
  {
    id: '2',
    text: 'Which of these is a prime number?',
    options: ['4', '6', '9', '7'],
    correctOptionIndex: 3,
    subject: 'Mathematics',
    classLevel: 'JS 1',
  },
  {
    id: '3',
    text: 'Who is the author of "The Gods Are Not To Blame"?',
    options: ['Wole Soyinka', 'Chinua Achebe', 'Ola Rotimi', 'Buchi Emecheta'],
    correctOptionIndex: 2,
    subject: 'English Literature',
    classLevel: 'SS 3',
  }
];

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [activeExam, setActiveExam] = useState<Exam | null>(null);
  const [lastResult, setLastResult] = useState<Result | null>(null);

  useEffect(() => {
    // Pre-populate if empty
    if (storage.getQuestions().length === 0) {
      storage.saveQuestions(DEFAULT_QUESTIONS);
    }

    // Check for active exam on mount
    const savedExam = storage.getActiveExam();
    if (savedExam) {
      setActiveExam(savedExam);
      setUser({
        id: savedExam.studentId,
        name: savedExam.studentName,
        role: 'student'
      });
    }
  }, []);

  const handleLogin = (user: User) => {
    setUser(user);
  };

  const handleLogout = () => {
    setUser(null);
    setActiveExam(null);
    setLastResult(null);
  };

  const handleStartExam = (exam: Exam) => {
    setActiveExam(exam);
    storage.saveActiveExam(exam);
  };

  const handleExamComplete = (result: Result) => {
    setLastResult(result);
    setActiveExam(null);
  };

  if (!user) {
    return (
      <>
        <Login onLogin={handleLogin} />
        <Toaster position="top-center" />
      </>
    );
  }

  if (user.role === 'admin') {
    return (
      <>
        <AdminDashboard onLogout={handleLogout} />
        <Toaster position="top-right" />
      </>
    );
  }

  // Student Flow
  return (
    <div className="min-h-screen bg-gradient-to-br from-muted/40 via-background to-muted/20">
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 py-3">
        <div className="container max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-lg font-bold tracking-tight">CBT Student Portal</h1>
            {!activeExam && <p className="text-xs text-muted-foreground">Welcome, {user.name}</p>}
          </div>
          {!activeExam && (
            <Button variant="outline" size="sm" onClick={handleLogout}>Logout</Button>
          )}
        </div>
      </header>

      <main className="container max-w-7xl mx-auto">
        {lastResult ? (
          <ExamResultSummary 
            result={lastResult} 
            onDone={() => setLastResult(null)} 
          />
        ) : activeExam ? (
          <ExamEngine 
            exam={activeExam} 
            onComplete={handleExamComplete} 
          />
        ) : (
          <StudentExamSelector 
            studentName={user.name} 
            onStartExam={handleStartExam} 
          />
        )}
      </main>
      <Toaster position="top-center" />
    </div>
  );
}

export default App;
