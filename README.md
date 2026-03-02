# NextJS Starter Template

A production-ready Next.js starter template with authentication, API keys, role-based access control, and comprehensive testing.

## Features

- **Authentication**: Credentials, Google OAuth, GitHub OAuth, and WebAuthn (passkeys)
- **API Keys**: Generate and manage API keys for programmatic access
- **Role-based Access Control**: User and admin roles with permission system
- **Database**: MongoDB with Prisma ORM
- **Styling**: Tailwind CSS with shadcn/ui (Stone theme)
- **Testing**: Vitest for unit tests, Playwright for e2e tests
- **CI/CD**: GitHub Actions workflow included

## Tech Stack

- Next.js 14 (App Router)
- TypeScript (strict mode)
- Bun package manager
- MongoDB + Prisma
- Auth.js (next-auth) v5
- Tailwind CSS + shadcn/ui
- Vitest + Playwright

## Getting Started

### Prerequisites

- Node.js 18+
- Bun 1.0+
- MongoDB (local or Atlas)

### Installation

1. Clone the repository
2. Install dependencies:

```bash
bun install
```

3. Configure environment variables:

```bash
cp .env.example .env.local
```

Update `.env.local` with your:

- MongoDB connection string
- Auth.js secret (run: `openssl rand -base64 32`)
- OAuth credentials (optional)

4. Generate Prisma client:

```bash
bun run db:generate
```

5. Push schema to database:

```bash
bun run db:push
```

6. Seed the database (optional):

```bash
bun run db:seed
```

### Development

```bash
bun run dev
```

The app will be available at http://localhost:3000

### Build

```bash
bun run build
```

### Production

```bash
bun run start
```

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── (auth)/            # Auth pages (sign-in, sign-up)
│   ├── (dashboard)/       # Protected dashboard routes
│   └── api/               # API routes
├── components/
│   ├── ui/               # shadcn/ui components
│   └── *.tsx            # Custom components
├── features/             # Feature-based modules
│   ├── auth/            # Authentication features
│   └── api-keys/        # API key management
├── hooks/               # Custom React hooks
├── lib/                 # Core utilities
│   ├── auth.ts         # Auth.js configuration
│   ├── db.ts           # Prisma client
│   └── utils.ts        # Utility functions
├── services/           # Repository pattern
│   └── repository/     # Data access layer
└── types/             # TypeScript types
```

## Authentication

### Providers

- **Credentials**: Email/password with bcrypt hashing
- **Google OAuth**: Configure `AUTH_GOOGLE_ID` and `AUTH_GOOGLE_SECRET`
- **GitHub OAuth**: Configure `AUTH_GITHUB_ID` and `AUTH_GITHUB_SECRET`
- **WebAuthn**: Passkey support using simplewebauthn

### Environment Variables

```env
DATABASE_URL="mongodb://localhost:27017/nextjs-starter"
AUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
AUTH_GOOGLE_ID=""
AUTH_GOOGLE_SECRET=""
AUTH_GITHUB_ID=""
AUTH_GITHUB_SECRET=""
```

## API Keys

The API keys feature allows users to generate secure API keys for programmatic access:

- Keys are securely hashed in the database
- Only the prefix is displayed after creation
- Keys can optionally expire
- Last used timestamp is tracked

## Testing

### Unit Tests

```bash
bun run test
bun run test:coverage
```

### E2E Tests

```bash
bun run test:e2e
bun run test:e2e:ui
```

## Scripts

| Command               | Description              |
| --------------------- | ------------------------ |
| `bun run dev`         | Start development server |
| `bun run build`       | Build for production     |
| `bun run start`       | Start production server  |
| `bun run lint`        | Run ESLint               |
| `bun run typecheck`   | Run TypeScript check     |
| `bun run db:generate` | Generate Prisma client   |
| `bun run db:push`     | Push schema to database  |
| `bun run db:seed`     | Seed database            |
| `bun run test`        | Run unit tests           |
| `bun run test:e2e`    | Run e2e tests            |

## Deployment

### Vercel

1. Connect your repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy

### Docker

```dockerfile
FROM oven/bun:1.0 AS base
WORKDIR /app

FROM base AS deps
COPY package.json bun.lockb ./
RUN bun install --frozen-lockfile

FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN bunx prisma generate
RUN bun run build

FROM base AS runner
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
EXPOSE 3000
CMD ["bun", "run", "start"]
```

## License

MIT
