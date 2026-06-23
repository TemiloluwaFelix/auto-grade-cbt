import React, { useState, useEffect } from 'react';
import { storage } from '../../lib/storage';
import { Question, ClassLevel } from '../../types';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Trash2, Plus, Check, Database } from 'lucide-react';
import { toast } from 'sonner';

const CLASSES: ClassLevel[] = ['JS 1', 'JS 2', 'JS 3', 'SS 1', 'SS 2', 'SS 3'];

export function QuestionManager() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [newQuestion, setNewQuestion] = useState<Partial<Question>>({
    text: '',
    options: ['', '', '', ''],
    correctOptionIndex: 0,
    subject: '',
    classLevel: 'JS 1',
  });

  useEffect(() => {
    setQuestions(storage.getQuestions());
  }, []);

  const handleAddQuestion = () => {
    if (!newQuestion.text || !newQuestion.subject || newQuestion.options?.some(o => !o)) {
      toast.error('Please fill all fields');
      return;
    }

    const question: Question = {
      ...(newQuestion as Question),
      id: crypto.randomUUID(),
    };

    const updated = [...questions, question];
    setQuestions(updated);
    storage.saveQuestions(updated);
    setNewQuestion({
      ...newQuestion,
      text: '',
      options: ['', '', '', ''],
    });
    toast.success('Question added successfully');
  };

  const handleDeleteQuestion = (id: string) => {
    const updated = questions.filter(q => q.id !== id);
    setQuestions(updated);
    storage.saveQuestions(updated);
    toast.success('Question deleted');
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Add New Question</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Subject</Label>
              <Input 
                value={newQuestion.subject} 
                onChange={e => setNewQuestion({...newQuestion, subject: e.target.value})}
                placeholder="e.g. Mathematics"
              />
            </div>
            <div className="space-y-2">
              <Label>Class Level</Label>
              <Select 
                value={newQuestion.classLevel} 
                onValueChange={v => setNewQuestion({...newQuestion, classLevel: v as ClassLevel})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CLASSES.map(c => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Question Text</Label>
            <Input 
              value={newQuestion.text} 
              onChange={e => setNewQuestion({...newQuestion, text: e.target.value})}
              placeholder="Enter question text"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {newQuestion.options?.map((option, idx) => (
              <div key={idx} className="space-y-2">
                <Label>Option {String.fromCharCode(65 + idx)}</Label>
                <div className="flex gap-2">
                  <Input 
                    value={option} 
                    onChange={e => {
                      const opts = [...(newQuestion.options || [])];
                      opts[idx] = e.target.value;
                      setNewQuestion({...newQuestion, options: opts});
                    }}
                  />
                  <Button 
                    variant={newQuestion.correctOptionIndex === idx ? "default" : "outline"}
                    onClick={() => setNewQuestion({...newQuestion, correctOptionIndex: idx})}
                    className="shrink-0"
                  >
                    <Check className="mr-1 h-3 w-3" /> {newQuestion.correctOptionIndex === idx ? 'Correct' : 'Mark'}
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <Button onClick={handleAddQuestion} className="w-full mt-2">
            <Plus className="mr-2 h-4 w-4" /> Add Question
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Question Bank ({questions.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Class</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Question</TableHead>
                <TableHead>Correct Option</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {questions.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-12">
                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                      <Database className="h-10 w-10 opacity-40" />
                      <p className="font-medium">No questions yet</p>
                      <p className="text-sm">Add your first question using the form above.</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
              {questions.map(q => (
                <TableRow key={q.id}>
                  <TableCell>{q.classLevel}</TableCell>
                  <TableCell>{q.subject}</TableCell>
                  <TableCell className="max-w-xs truncate">{q.text}</TableCell>
                  <TableCell>{String.fromCharCode(65 + q.correctOptionIndex)}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => handleDeleteQuestion(q.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
