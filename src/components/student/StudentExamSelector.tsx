import React, { useState, useEffect } from 'react';
import { storage, shuffleArray } from '../../lib/storage';
import { ClassLevel, Question, Exam } from '../../types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { BookOpen, GraduationCap, Play, Clock, HelpCircle } from 'lucide-react';
import { toast } from 'sonner';

interface StudentExamSelectorProps {
  studentName: string;
  onStartExam: (exam: Exam) => void;
}

const CLASSES: ClassLevel[] = ['JS 1', 'JS 2', 'JS 3', 'SS 1', 'SS 2', 'SS 3'];

export function StudentExamSelector({ studentName, onStartExam }: StudentExamSelectorProps) {
  const [classLevel, setClassLevel] = useState<ClassLevel>('JS 1');
  const [availableSubjects, setAvailableSubjects] = useState<string[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [questions, setQuestions] = useState<Question[]>([]);

  useEffect(() => {
    const allQuestions = storage.getQuestions();
    setQuestions(allQuestions);
    
    const subjects = Array.from(new Set(
      allQuestions
        .filter(q => q.classLevel === classLevel)
        .map(q => q.subject)
    ));
    setAvailableSubjects(subjects);
    if (subjects.length > 0) {
      setSelectedSubject(subjects[0]);
    } else {
      setSelectedSubject('');
    }
  }, [classLevel]);

  const handleStart = () => {
    if (!selectedSubject) {
      toast.error('No exams available for this class');
      return;
    }

    const subjectQuestions = questions.filter(
      q => q.classLevel === classLevel && q.subject === selectedSubject
    );

    if (subjectQuestions.length === 0) {
      toast.error('No questions found for this subject');
      return;
    }

    const exam: Exam = {
      id: crypto.randomUUID(),
      studentName,
      studentId: studentName.toLowerCase().replace(/\s+/g, '-'),
      classLevel,
      subject: selectedSubject,
      questions: shuffleArray(subjectQuestions),
      startTime: Date.now(),
      durationMinutes: 30, // Default 30 mins
      answers: {},
      status: 'ongoing',
    };

    onStartExam(exam);
  };

  return (
    <div className="max-w-md mx-auto space-y-6 pt-12">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">Welcome, {studentName}</h2>
        <p className="text-muted-foreground">Select your class and subject to begin the examination.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" /> Exam Selection
          </CardTitle>
          <CardDescription>All exams are timed. Once started, the timer cannot be paused.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Your Class</Label>
            <Select value={classLevel} onValueChange={v => setClassLevel(v as ClassLevel)}>
              <SelectTrigger>
                <div className="flex items-center gap-2">
                  <GraduationCap className="h-4 w-4" />
                  <SelectValue />
                </div>
              </SelectTrigger>
              <SelectContent>
                {CLASSES.map(c => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Subject</Label>
            <Select 
              value={selectedSubject} 
              onValueChange={setSelectedSubject}
              disabled={availableSubjects.length === 0}
            >
              <SelectTrigger>
                <SelectValue placeholder={availableSubjects.length === 0 ? "No subjects available" : "Select Subject"} />
              </SelectTrigger>
              <SelectContent>
                {availableSubjects.map(s => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedSubject && (
            <div className="flex items-center gap-4 text-sm text-muted-foreground bg-muted/50 rounded-lg p-3">
              <div className="flex items-center gap-1">
                <HelpCircle className="h-4 w-4" />
                <span>{questions.filter(q => q.classLevel === classLevel && q.subject === selectedSubject).length} questions</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>30 minutes</span>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button className="w-full" onClick={handleStart} disabled={!selectedSubject}>
            <Play className="mr-2 h-4 w-4" /> Start Examination
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
