'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { createApiKey, deleteApiKey } from '@/features/api-keys/actions';
import { useToast } from '@/components/ui/use-toast';
import { formatDate } from '@/lib/utils';
import { Trash2, Plus, Copy, Check } from 'lucide-react';

interface ApiKeyData {
  id: string;
  name: string;
  prefix: string;
  expiresAt: Date | string | null;
  lastUsedAt: Date | string | null;
  createdAt: Date | string;
}

interface ApiKeysListProps {
  apiKeys: ApiKeyData[];
}

export function ApiKeysList({ apiKeys: initialApiKeys }: ApiKeysListProps) {
  const { toast } = useToast();
  const [apiKeys, setApiKeys] = useState(initialApiKeys);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [newApiKey, setNewApiKey] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const result = await createApiKey({ name: newKeyName });

    if (result?.error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: result.error,
      });
      setLoading(false);
      return;
    }

    if (result?.apiKey) {
      setApiKeys([
        {
          ...result.apiKey,
          prefix: result.apiKey.prefix,
          createdAt: new Date(),
          expiresAt: null,
          lastUsedAt: null,
        },
        ...apiKeys,
      ]);
      setNewApiKey(result.apiKey.key);
    }

    setNewKeyName('');
    setLoading(false);
  }

  async function handleDelete(id: string) {
    const result = await deleteApiKey(id);

    if (result?.error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: result.error,
      });
      return;
    }

    setApiKeys(apiKeys.filter((k) => k.id !== id));
    toast({
      title: 'Success',
      description: 'API key deleted',
    });
  }

  function handleCopy() {
    if (newApiKey) {
      navigator.clipboard.writeText(newApiKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  function handleClose() {
    setShowCreateForm(false);
    setNewApiKey(null);
  }

  return (
    <div className="space-y-6">
      {newApiKey && (
        <Card className="border-green-500 bg-green-50">
          <CardHeader>
            <CardTitle className="text-green-700">API Key Created</CardTitle>
            <CardDescription className="text-green-600">
              Make sure to copy your API key now. You won&apos;t be able to see it again.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Input value={newApiKey} readOnly />
              <Button variant="outline" size="icon" onClick={handleCopy}>
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
            <Button className="mt-4" onClick={handleClose} variant="secondary">
              Close
            </Button>
          </CardContent>
        </Card>
      )}

      {showCreateForm && !newApiKey && (
        <form onSubmit={handleCreate} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="keyName">Key Name</Label>
            <Input
              id="keyName"
              value={newKeyName}
              onChange={(e) => setNewKeyName(e.target.value)}
              placeholder="My API Key"
              required
            />
          </div>
          <div className="flex gap-2">
            <Button type="submit" disabled={loading}>
              {loading ? 'Creating...' : 'Create Key'}
            </Button>
            <Button type="button" variant="outline" onClick={() => setShowCreateForm(false)}>
              Cancel
            </Button>
          </div>
        </form>
      )}

      {!showCreateForm && !newApiKey && (
        <Button onClick={() => setShowCreateForm(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Create New Key
        </Button>
      )}

      {apiKeys.length > 0 && (
        <div className="space-y-2">
          {apiKeys.map((key) => (
            <div key={key.id} className="flex items-center justify-between rounded-lg border p-4">
              <div>
                <p className="font-medium">{key.name}</p>
                <p className="font-mono text-sm text-muted-foreground">{key.prefix}...</p>
                <p className="text-xs text-muted-foreground">
                  Created: {formatDate(key.createdAt)}
                  {key.lastUsedAt && ` | Last used: ${formatDate(key.lastUsedAt)}`}
                </p>
              </div>
              <Button variant="ghost" size="icon" onClick={() => handleDelete(key.id)}>
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {apiKeys.length === 0 && !showCreateForm && (
        <p className="text-sm text-muted-foreground">No API keys yet. Create one to get started.</p>
      )}
    </div>
  );
}
