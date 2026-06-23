import React, { useState, useEffect } from 'react';
import { storage } from '../../lib/storage';
import { Result } from '../../types';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import { ClipboardList } from 'lucide-react';

export function ResultsViewer() {
  const [results, setResults] = useState<Result[]>([]);

  useEffect(() => {
    setResults(storage.getResults());
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Exam Results</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Student Name</TableHead>
              <TableHead>Class</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead>Score</TableHead>
              <TableHead>Percentage</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {results.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(r => (
              <TableRow key={r.id}>
                <TableCell>{new Date(r.date).toLocaleDateString()}</TableCell>
                <TableCell className="font-medium">{r.studentName}</TableCell>
                <TableCell>{r.classLevel}</TableCell>
                <TableCell>{r.subject}</TableCell>
                <TableCell>{r.score} / {r.totalQuestions}</TableCell>
                <TableCell>
                  <Badge variant={r.score / r.totalQuestions >= 0.5 ? "default" : "destructive"}>
                    {Math.round((r.score / r.totalQuestions) * 100)}%
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
            {results.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-12">
                  <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <ClipboardList className="h-10 w-10 opacity-40" />
                    <p className="font-medium">No exam results yet</p>
                    <p className="text-sm">Results will appear here once students complete examinations.</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
