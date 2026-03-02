import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { getApiKeys } from '@/features/api-keys/actions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ApiKeysList } from '@/features/api-keys/components/api-keys-list';

export default async function ApiKeysPage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/sign-in');
  }

  const apiKeys = await getApiKeys();

  return (
    <div className="container mx-auto py-10">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">API Keys</h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Your API Keys</CardTitle>
          <CardDescription>
            Manage your API keys for accessing the API programmatically
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ApiKeysList apiKeys={apiKeys} />
        </CardContent>
      </Card>
    </div>
  );
}
