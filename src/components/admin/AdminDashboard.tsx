import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { QuestionManager } from './QuestionManager';
import { ResultsViewer } from './ResultsViewer';
import { Button } from '../ui/button';
import { LogOut, LayoutDashboard, Database, ClipboardList } from 'lucide-react';

interface AdminDashboardProps {
  onLogout: () => void;
}

export function AdminDashboard({ onLogout }: AdminDashboardProps) {
  return (
    <div className="min-h-screen bg-muted/30">
      <header className="sticky top-0 z-10 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4 sm:px-8 max-w-7xl mx-auto">
          <div className="flex items-center gap-2">
            <LayoutDashboard className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold tracking-tight">CBT Admin Portal</h1>
          </div>
          <Button variant="ghost" size="sm" onClick={onLogout}>
            <LogOut className="mr-2 h-4 w-4" /> Logout
          </Button>
        </div>
      </header>

      <main className="container py-8 px-4 sm:px-8 max-w-7xl mx-auto">
        <Tabs defaultValue="questions" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="questions">
              <Database className="mr-2 h-4 w-4" /> Question Bank
            </TabsTrigger>
            <TabsTrigger value="results">
              <ClipboardList className="mr-2 h-4 w-4" /> Results
            </TabsTrigger>
          </TabsList>
          <TabsContent value="questions" className="space-y-4">
            <QuestionManager />
          </TabsContent>
          <TabsContent value="results" className="space-y-4">
            <ResultsViewer />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
