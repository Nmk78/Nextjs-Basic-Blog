'use server';

import { db } from '@/lib/db';
import bcrypt from 'bcryptjs';
import { signInSchema, signUpSchema } from '@/lib/validations';
import { redirect } from 'next/navigation';
import { z } from 'zod';

/** Validates credentials only. Use signIn('credentials', ...) from next-auth/react in the client to actually sign in. */
export async function signInAction(data: z.infer<typeof signInSchema>) {
  const validatedFields = signInSchema.safeParse(data);
  if (!validatedFields.success) {
    return { error: 'Invalid fields' };
  }
  return { success: true, data: validatedFields.data };
}

export async function signUpAction(data: z.infer<typeof signUpSchema>) {
  const validatedFields = signUpSchema.safeParse(data);

  if (!validatedFields.success) {
    return { error: 'Invalid fields' };
  }

  const { name, email, password } = validatedFields.data;

  const existingUser = await db.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    return { error: 'Email already in use' };
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  await db.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });

  redirect('/sign-in');
}

export async function signOutAction() {
  redirect('/api/auth/signout?callbackUrl=/');
}
