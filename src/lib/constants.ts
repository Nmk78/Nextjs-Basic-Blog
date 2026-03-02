export const APP_NAME = 'NextJS Starter';
export const APP_DESCRIPTION =
  'Production-ready Next.js starter template with auth, API keys, and more';

export const ROUTES = {
  HOME: '/',
  SIGN_IN: '/sign-in',
  SIGN_UP: '/sign-up',
  SIGN_OUT: '/sign-out',
  DASHBOARD: '/dashboard',
  SETTINGS: '/settings',
  API_KEYS: '/settings/api-keys',
} as const;

export const PUBLIC_ROUTES = ['/', '/sign-in', '/sign-up', '/api/auth'];

export const PROTECTED_ROUTES = ['/dashboard', '/settings'];

export const AUTH_PROVIDERS = {
  CREDENTIALS: 'credentials',
  GOOGLE: 'google',
  GITHUB: 'github',
} as const;

export const USER_ROLES = {
  USER: 'user',
  ADMIN: 'admin',
} as const;

export const PERMISSIONS = {
  MANAGE_API_KEYS: 'manage_api_keys',
  MANAGE_USERS: 'manage_users',
  VIEW_DASHBOARD: 'view_dashboard',
} as const;

export const ROLE_PERMISSIONS: Record<string, string[]> = {
  user: [PERMISSIONS.VIEW_DASHBOARD, PERMISSIONS.MANAGE_API_KEYS],
  admin: [PERMISSIONS.VIEW_DASHBOARD, PERMISSIONS.MANAGE_API_KEYS, PERMISSIONS.MANAGE_USERS],
};
