import { z } from 'zod';

export const signInSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const signUpSchema = z
  .object({
    name: z.string().min(1, 'Name is required').max(100, 'Name is too long'),
    email: z.string().email('Invalid email address'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .max(100, 'Password is too long'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export const apiKeySchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name is too long'),
  expiresAt: z.string().optional(),
});

export type SignInInput = z.infer<typeof signInSchema>;
export type SignUpInput = z.infer<typeof signUpSchema>;
export type ApiKeyInput = z.infer<typeof apiKeySchema>;
