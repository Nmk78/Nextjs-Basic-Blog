import { db } from '@/lib/db';
import { User, ApiKey } from '@prisma/client';
import { generateApiKey, truncate } from '@/lib/utils';

export class UserRepository {
  async findByEmail(email: string): Promise<User | null> {
    return db.user.findUnique({
      where: { email },
    });
  }

  async findById(id: string): Promise<User | null> {
    return db.user.findUnique({
      where: { id },
    });
  }

  async create(data: { email: string; name?: string; password: string }): Promise<User> {
    return db.user.create({
      data,
    });
  }

  async update(id: string, data: Partial<User>): Promise<User> {
    return db.user.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<void> {
    await db.user.delete({
      where: { id },
    });
  }
}

export class ApiKeyRepository {
  async findByUserId(userId: string): Promise<ApiKey[]> {
    return db.apiKey.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByKey(key: string): Promise<ApiKey | null> {
    return db.apiKey.findUnique({
      where: { key },
    });
  }

  async findById(id: string): Promise<ApiKey | null> {
    return db.apiKey.findUnique({
      where: { id },
    });
  }

  async create(data: { name: string; userId: string; expiresAt?: Date }): Promise<ApiKey> {
    const key = generateApiKey();
    const prefix = truncate(key, 8);

    return db.apiKey.create({
      data: {
        name: data.name,
        userId: data.userId,
        key,
        prefix,
        expiresAt: data.expiresAt,
      },
    });
  }

  async delete(id: string): Promise<void> {
    await db.apiKey.delete({
      where: { id },
    });
  }

  async updateLastUsed(id: string): Promise<void> {
    await db.apiKey.update({
      where: { id },
      data: { lastUsedAt: new Date() },
    });
  }
}

export const userRepository = new UserRepository();
export const apiKeyRepository = new ApiKeyRepository();
