import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function HomePage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-b from-background to-muted">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
      <div className="blur-100 absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-primary/5 opacity-60" />

      <div className="container relative z-10 px-4 py-16">
        <div className="mx-auto max-w-3xl space-y-8 text-center">
          <h1 className="text-4xl font-bold tracking-tight md:text-6xl">NextJS Starter Template</h1>
          <p className="text-xl text-muted-foreground">
            A production-ready starter template with authentication, blog, and more.
          </p>
          <div className="flex justify-center gap-4">
            <Button asChild size="lg">
              <Link href="/sign-in">Sign In</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/sign-up">Sign Up</Link>
            </Button>
          </div>

          <div className="flex justify-center">
            <Button asChild variant="ghost" size="lg">
              <Link href="/blog">View Blog</Link>
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
                <CardTitle>Blog</CardTitle>
                <CardDescription>Markdown posts</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Create and publish blog posts with Markdown support
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
