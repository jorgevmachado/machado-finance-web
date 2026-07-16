import { toSnakeCase } from './string';

describe('toSnakeCase', () => {
  it('Must convert a string to snake case', () => {
    expect(toSnakeCase('snakeCase')).toEqual('snake_case');
  });

  it('Must convert a string normalize to snake case', () => {
    expect(toSnakeCase('Snake Case')).toEqual('snake_case');
  });

  it('Must return value when not match', () => {
    expect(toSnakeCase('______')).toEqual('______');
  });

  it('Must return a string empty when value is undefined', () => {
    expect(toSnakeCase(undefined)).toEqual('');
  });
});