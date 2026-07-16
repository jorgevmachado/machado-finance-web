import { validateBasicEntity, validateCreatedAt, validateDateAt, validateValue } from './entity';

describe('entity utils', () => {
  afterEach(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  describe('validateDateAt', () => {
    it('returns undefined when dateString is missing', () => {
      expect(validateDateAt()).toBeUndefined();
    });

    it('returns undefined when dateString is invalid', () => {
      expect(validateDateAt('not-a-date')).toBeUndefined();
    });

    it('returns a Date when dateString is valid', () => {
      const result = validateDateAt('2026-07-15T12:00:00.000Z');

      expect(result).toBeInstanceOf(Date);
      expect(result?.toISOString()).toBe('2026-07-15T12:00:00.000Z');
    });
  });

  describe('validateCreatedAt', () => {
    it('returns the parsed date when dateString is valid', () => {
      const result = validateCreatedAt('2026-07-15T12:00:00.000Z');

      expect(result.toISOString()).toBe('2026-07-15T12:00:00.000Z');
    });

    it('returns the current date when dateString is missing or invalid', () => {
      jest.useFakeTimers();
      jest.setSystemTime(new Date('2026-07-16T00:00:00.000Z'));

      expect(validateCreatedAt()).toEqual(new Date('2026-07-16T00:00:00.000Z'));
      expect(validateCreatedAt('invalid')).toEqual(new Date('2026-07-16T00:00:00.000Z'));
    });
  });

  describe('validateValue', () => {
    it('returns the string value or default string fallback', () => {
      expect(validateValue('alpha')).toBe('alpha');
      expect(validateValue(undefined)).toBe('unknown');
      expect(validateValue(123 as unknown as string)).toBe('unknown');
      expect(validateValue(undefined, 'string', 'fallback')).toBe('fallback');
    });

    it('returns the number value or default number fallback', () => {
      expect(validateValue(42, 'number')).toBe(42);
      expect(validateValue(undefined, 'number')).toBe(0);
      expect(validateValue('42' as unknown as number, 'number')).toBe(0);
      expect(validateValue(undefined, 'number', 7)).toBe(7);
    });

    it('returns the generic fallback for unsupported type values', () => {
      expect(validateValue('alpha', 'string' as 'string' | 'number')).toBe('alpha');
      expect(validateValue('alpha', 'unknown' as unknown as 'string' | 'number')).toBe('unknown');
    });
  });

  describe('validateBasicEntity', () => {
    it('normalizes the base entity fields', () => {
      const result = validateBasicEntity<{
        id: string;
        created_at: Date;
        updated_at?: Date;
        deleted_at?: Date;
      }>({
        id: 'entity-1',
        created_at: '2026-07-15T12:00:00.000Z',
        updated_at: '2026-07-15T13:00:00.000Z',
        deleted_at: '2026-07-15T14:00:00.000Z',
      });

      expect(result.id).toBe('entity-1');
      expect(result.created_at.toISOString()).toBe('2026-07-15T12:00:00.000Z');
      expect(result.updated_at?.toISOString()).toBe('2026-07-15T13:00:00.000Z');
      expect(result.deleted_at?.toISOString()).toBe('2026-07-15T14:00:00.000Z');
    });

    it('falls back when optional timestamps are missing or invalid', () => {
      const result = validateBasicEntity<{
        id: string;
        created_at: Date;
        updated_at?: Date;
        deleted_at?: Date;
      }>({
        id: undefined,
        created_at: '2026-07-15T12:00:00.000Z',
        updated_at: 'invalid',
      });

      expect(result.id).toBe('unknown');
      expect(result.updated_at).toBeUndefined();
      expect(result.deleted_at).toBeUndefined();
    });
  });
});
