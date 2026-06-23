import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { User, ShieldCheck, GraduationCap, BookOpenCheck } from 'lucide-react';
import { User as UserType } from '../types';

interface LoginProps {
  onLogin: (user: UserType) => void;
}

export function Login({ onLogin }: LoginProps) {
  const [name, setName] = useState('');
  const [adminKey, setAdminKey] = useState('');

  const handleStudentLogin = () => {
    if (!name.trim()) return;
    onLogin({
      id: crypto.randomUUID(),
      name,
      role: 'student',
    });
  };

  const handleAdminLogin = () => {
    if (adminKey === 'admin123') {
      onLogin({
        id: 'admin',
        name: 'School Admin',
        role: 'admin',
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-muted/50 via-background to-muted/30 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-2">
            <div className="p-3 bg-primary/10 rounded-2xl">
              <BookOpenCheck className="h-10 w-10 text-primary" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold tracking-tight">CBT Portal</CardTitle>
          <CardDescription className="mt-1">School Internal Examination System</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="student">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="student">
                <GraduationCap className="mr-2 h-4 w-4" /> Student
              </TabsTrigger>
              <TabsTrigger value="admin">
                <ShieldCheck className="mr-2 h-4 w-4" /> Admin
              </TabsTrigger>
            </TabsList>

            <TabsContent value="student" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="name" 
                    placeholder="Enter your full name" 
                    className="pl-9"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              </div>
              <Button className="w-full" onClick={handleStudentLogin} disabled={!name}>
                Access Student Portal
              </Button>
            </TabsContent>

            <TabsContent value="admin" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="key">Admin Access Key</Label>
                <div className="relative">
                  <ShieldCheck className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="key" 
                    type="password" 
                    placeholder="Enter admin key (admin123)" 
                    className="pl-9"
                    value={adminKey}
                    onChange={(e) => setAdminKey(e.target.value)}
                  />
                </div>
              </div>
              <Button className="w-full" variant="outline" onClick={handleAdminLogin} disabled={adminKey !== 'admin123'}>
                Login as Admin
              </Button>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex-col gap-1 text-center text-sm text-muted-foreground justify-center border-t pt-4">
          <p className="font-medium">For internal school examinations only</p>
          <p className="text-xs">Supporting JS 1 – SS 3 across all subjects</p>
        </CardFooter>
      </Card>
    </div>
  );
}
