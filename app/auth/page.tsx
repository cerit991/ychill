"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AuthPage() {
  const [isSignUp, setIsSignUp] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically handle the authentication logic
    console.log('Submitting:', { email, password, isSignUp });
    // For now, we'll just redirect to the explore page
    router.push('/explore');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{isSignUp ? 'Sign Up' : 'Sign In'}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Button type="submit" className="w-full">
              {isSignUp ? 'Sign Up' : 'Sign In'}
            </Button>
          </form>
          <div className="mt-4 text-center">
            <Button
              variant="link"
              onClick={() => setIsSignUp(!isSignUp)}
            >
              {isSignUp ? 'Already have an account? Sign In' : 'Need an account? Sign Up'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}