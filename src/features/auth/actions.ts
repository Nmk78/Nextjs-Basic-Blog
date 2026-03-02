'use server';

import { signIn } from '@/lib/auth';
import { db } from '@/lib/db';
import bcrypt from 'bcryptjs';
import { signInSchema, signUpSchema } from '@/lib/validations';
import { redirect } from 'next/navigation';
import { z } from 'zod';

export async function signInAction(data: z.infer<typeof signInSchema>) {
  const validatedFields = signInSchema.safeParse(data);

  if (!validatedFields.success) {
    return { error: 'Invalid fields' };
  }

  try {
    await signIn('credentials', {
      email: validatedFields.data.email,
      password: validatedFields.data.password,
      redirect: false,
    });
    return { success: true };
  } catch (error) {
    console.log('🚀 ~ signInAction ~ error:', error);
    return { error: 'Invalid credentials' };
  }
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
  await signIn();
}
