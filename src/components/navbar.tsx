'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import { cn } from '@/lib/utils';
import { Menu, X, LogOut, User } from 'lucide-react';
import { Button } from '@/components/ui/button';

const navItems = [
  { href: '/', label: 'Home' },
  { href: '/blog', label: 'Blog' },
];

export function Navbar() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-xl font-bold">Hacker News</span>
        </Link>

        <nav className="hidden items-center gap-4 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'text-sm font-medium transition-colors hover:text-primary',
                pathname === item.href ? 'text-primary' : 'text-muted-foreground'
              )}
            >
              {item.label}
            </Link>
          ))}
          {status === 'authenticated' ? (
            <div className="flex items-center gap-2">
              {session?.user?.image ? (
                <Link href="/dashboard">
                  <img
                    src={session.user.image}
                    alt={session.user.name || ''}
                    className="h-8 w-8 rounded-full"
                  />
                </Link>
              ) : (
                <Button variant="ghost" size="icon" asChild>
                  <Link href="/dashboard">
                    <User className="h-4 w-4" />
                  </Link>
                </Button>
              )}
              <Button variant="ghost" size="icon" onClick={() => signOut()}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          ) : status === 'unauthenticated' ? (
            <Link href="/sign-in">
              <Button size="sm">Sign In</Button>
            </Link>
          ) : null}
        </nav>

        <button
          className="p-2 md:hidden"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {isOpen && (
        <nav className="border-t bg-background md:hidden">
          <div className="container space-y-3 px-4 py-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  'block py-2 text-sm font-medium transition-colors hover:text-primary',
                  pathname === item.href ? 'text-primary' : 'text-muted-foreground'
                )}
              >
                {item.label}
              </Link>
            ))}
            {status === 'authenticated' && (
              <Link
                href="/dashboard"
                onClick={() => setIsOpen(false)}
                className="block py-2 text-sm font-medium transition-colors hover:text-primary"
              >
                Dashboard
              </Link>
            )}
            {status === 'authenticated' ? (
              <button
                onClick={() => {
                  setIsOpen(false);
                  signOut();
                }}
                className="block w-full py-2 text-left text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
              >
                Sign Out
              </button>
            ) : status === 'unauthenticated' ? (
              <Link
                href="/sign-in"
                onClick={() => setIsOpen(false)}
                className="block py-2 text-sm font-medium text-primary"
              >
                Sign In
              </Link>
            ) : null}
          </div>
        </nav>
      )}
    </header>
  );
}
