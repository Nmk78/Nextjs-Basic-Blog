import { Prisma } from '@prisma/client';
import { db } from '@/lib/db';

const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_DURATION_MINUTES = 15;
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = 20;

interface RateLimitRecord {
  count: number;
  firstRequest: number;
  lockedUntil?: number;
}

const rateLimitStore = new Map<string, RateLimitRecord>();

function cleanupStore() {
  const now = Date.now();
  const keysToDelete: string[] = [];

  rateLimitStore.forEach((value, key) => {
    if (value.firstRequest < now - RATE_LIMIT_WINDOW_MS * 2) {
      keysToDelete.push(key);
    }
    if (value.lockedUntil && value.lockedUntil < now) {
      value.lockedUntil = undefined;
      value.count = 0;
      value.firstRequest = now;
    }
  });

  keysToDelete.forEach((key) => rateLimitStore.delete(key));
}

setInterval(cleanupStore, 60 * 60 * 1000);

export interface RateLimitResult {
  success: boolean;
  remainingAttempts?: number;
  lockedUntil?: number;
  message?: string;
}

export async function checkRateLimit(
  identifier: string,
  maxRequests: number = MAX_REQUESTS_PER_WINDOW,
  windowMs: number = RATE_LIMIT_WINDOW_MS
): Promise<RateLimitResult> {
  const now = Date.now();
  const record = rateLimitStore.get(identifier);

  if (!record) {
    rateLimitStore.set(identifier, { count: 1, firstRequest: now });
    return { success: true, remainingAttempts: maxRequests - 1 };
  }

  if (record.lockedUntil && record.lockedUntil > now) {
    const remainingSeconds = Math.ceil((record.lockedUntil - now) / 1000);
    return {
      success: false,
      lockedUntil: record.lockedUntil,
      message: `Too many attempts. Try again in ${remainingSeconds} seconds.`,
    };
  }

  if (now - record.firstRequest > windowMs) {
    rateLimitStore.set(identifier, { count: 1, firstRequest: now });
    return { success: true, remainingAttempts: maxRequests - 1 };
  }

  if (record.count >= maxRequests) {
    const lockUntil = now + LOCKOUT_DURATION_MINUTES * 60 * 1000;
    record.lockedUntil = lockUntil;
    record.count = 0;
    return {
      success: false,
      lockedUntil: lockUntil,
      message: `Rate limit exceeded. Try again in ${LOCKOUT_DURATION_MINUTES} minutes.`,
    };
  }

  record.count++;
  return { success: true, remainingAttempts: maxRequests - record.count };
}

interface UserLoginInfo {
  loginAttempts?: number;
  lockedUntil?: Date | null;
  loginIp?: string | null;
}

export async function checkLoginAttempts(email: string): Promise<RateLimitResult> {
  const user = (await db.user.findUnique({
    where: { email },
  })) as (UserLoginInfo & { id: string }) | null;

  if (!user) {
    return { success: true, remainingAttempts: MAX_LOGIN_ATTEMPTS };
  }

  const now = Date.now();

  if (user.lockedUntil && new Date(user.lockedUntil).getTime() > now) {
    const remainingSeconds = Math.ceil((new Date(user.lockedUntil).getTime() - now) / 1000);
    return {
      success: false,
      lockedUntil: new Date(user.lockedUntil).getTime(),
      message: `Account locked due to too many failed attempts. Try again in ${Math.ceil(remainingSeconds / 60)} minutes.`,
    };
  }

  const loginAttempts = user.loginAttempts || 0;
  if (loginAttempts >= MAX_LOGIN_ATTEMPTS) {
    const lockUntil = new Date(now + LOCKOUT_DURATION_MINUTES * 60 * 1000);
    await db.user.update({
      where: { email },
      data: { lockedUntil: lockUntil } as Prisma.UserUpdateInput,
    });
    return {
      success: false,
      lockedUntil: lockUntil.getTime(),
      message: `Account locked due to too many failed attempts. Try again in ${LOCKOUT_DURATION_MINUTES} minutes.`,
    };
  }

  return { success: true, remainingAttempts: MAX_LOGIN_ATTEMPTS - loginAttempts };
}

export async function recordFailedLogin(email: string, ip?: string) {
  const user = (await db.user.findUnique({
    where: { email },
  })) as (UserLoginInfo & { id: string }) | null;

  const newAttempts = (user?.loginAttempts || 0) + 1;
  const shouldLock = newAttempts >= MAX_LOGIN_ATTEMPTS;
  const lockUntil = shouldLock ? new Date(Date.now() + LOCKOUT_DURATION_MINUTES * 60 * 1000) : null;

  await db.user.update({
    where: { email },
    data: {
      loginAttempts: newAttempts,
      lockedUntil: lockUntil,
      loginIp: ip,
    } as Prisma.UserUpdateInput,
  });
}

export async function recordSuccessfulLogin(email: string, ip?: string) {
  await db.user.update({
    where: { email },
    data: {
      loginAttempts: 0,
      lockedUntil: null,
      loginIp: ip,
      lastLoginAt: new Date(),
    } as Prisma.UserUpdateInput,
  });
}

export function getClientIp(req: Request): string {
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) {
    const parts = forwarded.split(',');
    return parts[0]?.trim() || 'unknown';
  }
  return req.headers.get('x-real-ip') || 'unknown';
}
