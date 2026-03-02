import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/sign-in');
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="mb-6 text-3xl font-bold">Dashboard</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Welcome</CardTitle>
            <CardDescription>Your account overview</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Signed in as <strong>{session.user.name || session.user.email}</strong>
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Role</CardTitle>
            <CardDescription>Your current role</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Role: <strong>{session.user.role}</strong>
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Manage your{' '}
              <a href="/settings/api-keys" className="underline">
                API Keys
              </a>
            </p>
            <p className="text-sm text-muted-foreground">
              Update your{' '}
              <a href="/settings" className="underline">
                Profile
              </a>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
