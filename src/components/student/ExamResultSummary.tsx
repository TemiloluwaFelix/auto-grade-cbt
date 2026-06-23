import React from 'react';
import { Result } from '../../types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { CheckCircle2, XCircle, Award, RotateCcw, Calendar, BookOpen } from 'lucide-react';

interface ExamResultSummaryProps {
  result: Result;
  onDone: () => void;
}

export function ExamResultSummary({ result, onDone }: ExamResultSummaryProps) {
  const percentage = Math.round((result.score / result.totalQuestions) * 100);
  const isPassed = percentage >= 50;

  return (
    <div className="max-w-md mx-auto py-12 px-4">
      <Card className="text-center">
        <CardHeader>
          <div className="flex justify-center mb-4">
            {isPassed ? (
              <div className="p-3 bg-green-100 rounded-full">
                <CheckCircle2 className="h-12 w-12 text-green-600" />
              </div>
            ) : (
              <div className="p-3 bg-destructive/10 rounded-full">
                <XCircle className="h-12 w-12 text-destructive" />
              </div>
            )}
          </div>
          <CardTitle className="text-2xl">Examination Completed</CardTitle>
          <p className="text-muted-foreground">{result.subject} - {result.classLevel}</p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Your Score</p>
            <div className="flex items-center justify-center gap-2">
              <span className="text-5xl font-bold">{result.score}</span>
              <span className="text-2xl text-muted-foreground">/ {result.totalQuestions}</span>
            </div>
          </div>

          <div className="flex flex-col items-center gap-2">
            <Badge variant={isPassed ? "default" : "destructive"} className="text-lg px-4 py-1">
              {percentage}%
            </Badge>
            <p className="text-sm">
              {isPassed ? "Congratulations! You passed." : "Better luck next time."}
            </p>
          </div>

          <div className="bg-muted p-4 rounded-lg space-y-3 text-left">
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">Student Name</p>
              <p className="font-semibold">{result.studentName}</p>
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Calendar className="h-3 w-3" />
              {new Date(result.date).toLocaleDateString('en-NG', { day: 'numeric', month: 'long', year: 'numeric' })}
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <BookOpen className="h-4 w-4" />
            <span>{result.classLevel} — {result.subject}</span>
            <Award className={`h-5 w-5 ml-auto ${isPassed ? 'text-yellow-500' : 'text-muted-foreground'}`} />
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full" onClick={onDone}>
            <RotateCcw className="mr-2 h-4 w-4" /> Return to Dashboard
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
