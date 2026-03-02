import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function HomePage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-b from-background to-muted">
      <div className="container px-4 py-16">
        <div className="mx-auto max-w-3xl space-y-8 text-center">
          <h1 className="text-4xl font-bold tracking-tight md:text-6xl">NextJS Starter Template</h1>
          <p className="text-xl text-muted-foreground">
            A production-ready starter template with authentication, API keys, and more.
          </p>
          <div className="flex justify-center gap-4">
            <Button asChild size="lg">
              <Link href="/sign-in">Sign In</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/sign-up">Sign Up</Link>
            </Button>
          </div>

          <div className="mt-16 grid gap-6 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Authentication</CardTitle>
                <CardDescription>Multiple providers</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Credentials, Google, GitHub, and WebAuthn support
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>API Keys</CardTitle>
                <CardDescription>Secure access</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Generate and manage API keys for your applications
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Role-based Access</CardTitle>
                <CardDescription>Fine-grained control</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  User and admin roles with customizable permissions
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}
