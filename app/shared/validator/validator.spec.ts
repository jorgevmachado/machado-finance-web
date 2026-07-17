jest.mock('../actions', () => ({}));

import { Validator } from './validator';

type Draft = { name?: string; description?: string };

class TestValidator extends Validator<{ id: string }, Draft, Draft, Draft> {
  transformCreate(draft: Draft): Draft {
    return draft;
  }

  transformUpdate(draft: Draft): Draft {
    return draft;
  }

  validateCreate(): null {
    return null;
  }

  validateUpdate(): null {
    return null;
  }

  hasEntityChanged(): boolean {
    return false;
  }
}

describe('Validator', () => {
  const validator = new TestValidator();

  it('validates names for create and update modes', () => {
    expect(validator.isValidName(undefined, 'create')).toBe(false);
    expect(validator.isValidName('ab', 'create')).toBe(false);
    expect(validator.isValidName('abc', 'create')).toBe(true);
    expect(validator.isValidName('a'.repeat(41), 'create')).toBe(false);

    expect(validator.isValidName(undefined, 'update')).toBe(true);
    expect(validator.isValidName('ab', 'update')).toBe(false);
    expect(validator.isValidName('valid name', 'update')).toBe(true);
  });

  it('uses create as default type for name validation', () => {
    expect(validator.isValidName('abc')).toBe(true);
    expect(validator.isValidName('ab')).toBe(false);
  });

  it('validates descriptions for create and update modes', () => {
    expect(validator.isValidDescription(undefined, 'create')).toBe(false);
    expect(validator.isValidDescription('ab', 'create')).toBe(false);
    expect(validator.isValidDescription('abc', 'create')).toBe(true);
    expect(validator.isValidDescription('a'.repeat(201), 'create')).toBe(false);

    expect(validator.isValidDescription(undefined, 'update')).toBe(true);
    expect(validator.isValidDescription('ab', 'update')).toBe(false);
    expect(validator.isValidDescription('updated description', 'update')).toBe(true);
  });

  it('uses create as default type for description validation', () => {
    expect(validator.isValidDescription('abc')).toBe(true);
    expect(validator.isValidDescription('ab')).toBe(false);
  });
});
