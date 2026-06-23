import React, { useState, useEffect, useCallback } from 'react';
import { Exam, Result } from '../../types';
import { storage } from '../../lib/storage';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Label } from '../ui/label';
import { Clock, ChevronLeft, ChevronRight, Send } from 'lucide-react';
import { toast } from 'sonner';

interface ExamEngineProps {
  exam: Exam;
  onComplete: (result: Result) => void;
}

export function ExamEngine({ exam, onComplete }: ExamEngineProps) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>(exam.answers);
  const [timeLeft, setTimeLeft] = useState(exam.durationMinutes * 60);

  const calculateScore = useCallback(() => {
    let score = 0;
    exam.questions.forEach(q => {
      if (answers[q.id] === q.correctOptionIndex) {
        score++;
      }
    });
    return score;
  }, [exam.questions, answers]);

  const handleSubmit = useCallback(() => {
    const score = calculateScore();
    const result: Result = {
      id: crypto.randomUUID(),
      studentName: exam.studentName,
      studentId: exam.studentId,
      classLevel: exam.classLevel,
      subject: exam.subject,
      score,
      totalQuestions: exam.questions.length,
      date: new Date().toISOString(),
    };

    storage.saveResult(result);
    storage.saveActiveExam(null);
    onComplete(result);
    toast.success('Examination submitted successfully!');
  }, [exam, answers, calculateScore, onComplete]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [handleSubmit]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const currentQuestion = exam.questions[currentIdx];

  const handleSelectOption = (idx: number) => {
    const newAnswers = { ...answers, [currentQuestion.id]: idx };
    setAnswers(newAnswers);
    storage.saveActiveExam({ ...exam, answers: newAnswers });
  };

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-background p-4 rounded-lg border shadow-sm sticky top-0 z-10">
        <div>
          <h2 className="text-xl font-bold">{exam.subject}</h2>
          <p className="text-sm text-muted-foreground">{exam.studentName} | {exam.classLevel}</p>
        </div>
        <div className={`flex items-center gap-2 px-4 py-2 rounded-full font-mono text-xl ${timeLeft < 300 ? 'bg-destructive/10 text-destructive animate-pulse' : 'bg-primary/10 text-primary'}`}>
          <Clock className="h-5 w-5" />
          {formatTime(timeLeft)}
        </div>
      </div>

      <div className="space-y-1">
        <Progress value={(Object.keys(answers).length / exam.questions.length) * 100} className="h-2" />
        <p className="text-xs text-muted-foreground text-right">{Object.keys(answers).length} of {exam.questions.length} answered</p>
      </div>

      <Card className="min-h-[400px] flex flex-col">
        <CardHeader>
          <CardTitle className="text-lg font-medium">
            Question {currentIdx + 1} of {exam.questions.length}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-grow space-y-6">
          <p className="text-xl leading-relaxed">{currentQuestion.text}</p>
          
          <RadioGroup 
            value={answers[currentQuestion.id]?.toString()} 
            onValueChange={v => handleSelectOption(parseInt(v))}
            className="space-y-3"
          >
            {currentQuestion.options.map((option, idx) => (
              <div key={idx} className="flex items-center space-x-3 space-y-0 border rounded-lg p-4 cursor-pointer hover:bg-accent/50 transition-colors has-[:checked]:bg-primary/5 has-[:checked]:border-primary">
                <RadioGroupItem value={idx.toString()} id={`opt-${idx}`} />
                <Label htmlFor={`opt-${idx}`} className="flex-grow cursor-pointer text-base">
                  <span className="font-bold mr-2">{String.fromCharCode(65 + idx)}.</span>
                  {option}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </CardContent>
        <CardFooter className="justify-between border-t pt-6">
          <Button 
            variant="outline" 
            onClick={() => setCurrentIdx(prev => prev - 1)} 
            disabled={currentIdx === 0}
          >
            <ChevronLeft className="mr-2 h-4 w-4" /> Previous
          </Button>

          {currentIdx === exam.questions.length - 1 ? (
            <Button onClick={handleSubmit} className="bg-green-600 hover:bg-green-700">
              <Send className="mr-2 h-4 w-4" /> Submit Exam
            </Button>
          ) : (
            <Button onClick={() => setCurrentIdx(prev => prev + 1)}>
              Next <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          )}
        </CardFooter>
      </Card>

      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Question Navigator</p>
      <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
        {exam.questions.map((q, idx) => (
          <Button
            key={q.id}
            variant={currentIdx === idx ? "default" : (answers[q.id] !== undefined ? "secondary" : "outline")}
            size="sm"
            className="h-10 w-full"
            onClick={() => setCurrentIdx(idx)}
          >
            {idx + 1}
          </Button>
        ))}
      </div>
    </div>
  );
}
