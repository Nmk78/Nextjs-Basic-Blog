'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PasswordStrength } from '@/components/password-strength';
import { signUpAction } from '@/features/auth/actions';
import { useToast } from '@/components/ui/use-toast';
import { Eye, EyeOff, CheckCircle, XCircle } from 'lucide-react';
import { Github, Chrome } from 'lucide-react';
import { signIn } from 'next-auth/react';

export default function SignUpPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const requirements = [
    { label: 'At least 8 characters', met: password.length >= 8 },
    { label: 'Contains uppercase letter', met: /[A-Z]/.test(password) },
    { label: 'Contains lowercase letter', met: /[a-z]/.test(password) },
    { label: 'Contains a number', met: /[0-9]/.test(password) },
    { label: 'Contains special character', met: /[!@#$%^&*]/.test(password) },
  ];

  const allMet =
    requirements.every((r) => r.met) && password === confirmPassword && password.length > 0;

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    if (!allMet) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Please meet all password requirements',
      });
      setLoading(false);
      return;
    }

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      password: formData.get('password') as string,
      confirmPassword: formData.get('confirmPassword') as string,
    };

    const result = await signUpAction(data);

    if (result?.error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: result.error,
      });
      setLoading(false);
      return;
    }

    router.push('/sign-in');
  }

  async function handleOAuthSignIn(provider: string) {
    await signIn(provider, { callbackUrl: '/dashboard' });
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-background to-muted px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Create an account</CardTitle>
          <CardDescription>Sign up with your email or OAuth provider</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              onClick={() => handleOAuthSignIn('google')}
              className="w-full"
            >
              <Chrome className="mr-2 h-4 w-4" />
              Google
            </Button>
            <Button
              variant="outline"
              onClick={() => handleOAuthSignIn('github')}
              className="w-full"
            >
              <Github className="mr-2 h-4 w-4" />
              GitHub
            </Button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">Or continue with email</span>
            </div>
          </div>

          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="John Doe"
                required
                autoComplete="name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="john@example.com"
                required
                autoComplete="email"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Create a strong password"
                  required
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
              <PasswordStrength password={password} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Confirm your password"
                  required
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
              {confirmPassword && password !== confirmPassword && (
                <p className="text-xs text-red-500">Passwords do not match</p>
              )}
              {confirmPassword && password === confirmPassword && password.length > 0 && (
                <p className="flex items-center gap-1 text-xs text-green-500">
                  <CheckCircle className="h-3 w-3" /> Passwords match
                </p>
              )}
            </div>

            <div className="space-y-2">
              <p className="text-xs font-medium">Password requirements:</p>
              <div className="grid grid-cols-2 gap-1">
                {requirements.map((req, i) => (
                  <div
                    key={i}
                    className={`flex items-center gap-1 text-xs ${
                      req.met ? 'text-green-500' : 'text-muted-foreground'
                    }`}
                  >
                    {req.met ? (
                      <CheckCircle className="h-3 w-3" />
                    ) : (
                      <XCircle className="h-3 w-3" />
                    )}
                    {req.label}
                  </div>
                ))}
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={loading || !allMet}>
              {loading ? 'Creating account...' : 'Create Account'}
            </Button>
          </form>

          <div className="text-center text-sm">
            Already have an account?{' '}
            <Link href="/sign-in" className="font-medium underline">
              Sign in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
