import { describe, it, expect } from 'vitest';
import { cn, truncate, formatDate, generateApiKey } from '@/lib/utils';

describe('utils', () => {
  describe('cn', () => {
    it('should merge class names', () => {
      expect(cn('foo', 'bar')).toBe('foo bar');
    });

    it('should handle conditional classes', () => {
      const condition = true;
      expect(cn('foo', condition && 'bar')).toBe('foo bar');
      expect(cn('foo', condition && 'bar', !condition && 'baz')).toBe('foo bar');
    });
  });

  describe('truncate', () => {
    it('should truncate long strings', () => {
      expect(truncate('hello world', 5)).toBe('hello...');
    });

    it('should not truncate short strings', () => {
      expect(truncate('hello', 10)).toBe('hello');
    });
  });

  describe('formatDate', () => {
    it('should format dates correctly', () => {
      const date = new Date('2024-01-15');
      expect(formatDate(date)).toContain('January');
      expect(formatDate(date)).toContain('15');
      expect(formatDate(date)).toContain('2024');
    });
  });

  describe('generateApiKey', () => {
    it('should generate a 32-character key', () => {
      const key = generateApiKey();
      expect(key).toHaveLength(32);
    });

    it('should generate unique keys', () => {
      const key1 = generateApiKey();
      const key2 = generateApiKey();
      expect(key1).not.toBe(key2);
    });
  });
});
