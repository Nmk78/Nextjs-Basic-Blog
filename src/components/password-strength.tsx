'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface PasswordStrengthProps {
  password: string;
}

export function PasswordStrength({ password }: PasswordStrengthProps) {
  const [strength, setStrength] = useState(0);
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    if (!password) {
      setStrength(0);
      setFeedback('');
      return;
    }

    // Dynamic import to avoid SSR issues
    import('zxcvbn').then((zxcvbn) => {
      const result = zxcvbn.default(password);
      setStrength(result.score);
      setFeedback(result.feedback.warning || result.feedback.suggestions[0] || '');
    });
  }, [password]);

  const colors = {
    0: 'bg-red-500',
    1: 'bg-red-400',
    2: 'bg-yellow-500',
    3: 'bg-yellow-400',
    4: 'bg-green-500',
  };

  const labels = {
    0: 'Very Weak',
    1: 'Weak',
    2: 'Fair',
    3: 'Good',
    4: 'Strong',
  };

  if (!password) return null;

  return (
    <div className="space-y-2">
      <div className="flex gap-1">
        {[0, 1, 2, 3, 4].map((level) => (
          <div
            key={level}
            className={cn(
              'h-1.5 flex-1 rounded-full transition-colors',
              level <= strength ? colors[level as keyof typeof colors] : 'bg-muted'
            )}
          />
        ))}
      </div>
      <div className="flex justify-between text-xs">
        <span
          className={cn(
            strength <= 1 && 'text-red-500',
            strength === 2 && 'text-yellow-500',
            strength >= 3 && 'text-green-500'
          )}
        >
          {labels[strength as keyof typeof labels]}
        </span>
        {feedback && <span className="text-muted-foreground">{feedback}</span>}
      </div>
    </div>
  );
}
