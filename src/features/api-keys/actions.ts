'use server';

import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { apiKeySchema } from '@/lib/validations';
import { z } from 'zod';

export async function getApiKeys() {
  const session = await auth();

  if (!session?.user?.id) {
    return [];
  }

  return db.apiKey.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      name: true,
      prefix: true,
      expiresAt: true,
      lastUsedAt: true,
      createdAt: true,
    },
  });
}

export async function createApiKey(data: z.infer<typeof apiKeySchema>) {
  const session = await auth();

  if (!session?.user?.id) {
    return { error: 'Unauthorized' };
  }

  const validatedFields = apiKeySchema.safeParse(data);

  if (!validatedFields.success) {
    return { error: 'Invalid fields' };
  }

  const { name, expiresAt } = validatedFields.data;

  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  const key = Array.from(array, (byte) => chars[byte % chars.length]).join('');
  const prefix = key.slice(0, 8);

  const apiKey = await db.apiKey.create({
    data: {
      name,
      userId: session.user.id,
      key,
      prefix,
      expiresAt: expiresAt ? new Date(expiresAt) : null,
    },
  });

  return { success: true, apiKey: { ...apiKey, key } };
}

export async function deleteApiKey(id: string) {
  const session = await auth();

  if (!session?.user?.id) {
    return { error: 'Unauthorized' };
  }

  const apiKey = await db.apiKey.findUnique({
    where: { id },
  });

  if (!apiKey || apiKey.userId !== session.user.id) {
    return { error: 'Not found' };
  }

  await db.apiKey.delete({
    where: { id },
  });

  return { success: true };
}

export async function verifyApiKey(key: string) {
  const apiKey = await db.apiKey.findUnique({
    where: { key },
  });

  if (!apiKey) {
    return null;
  }

  if (apiKey.expiresAt && apiKey.expiresAt < new Date()) {
    return null;
  }

  await db.apiKey.update({
    where: { id: apiKey.id },
    data: { lastUsedAt: new Date() },
  });

  return apiKey;
}
