jest.mock('@/app/shared', () => ({}));
jest.mock('@/app/shared/actions', () => ({}));
jest.mock('@/app/ds', () => ({}));

import { Business } from './business';

type TestFilter = { name?: string };
type TestEntity = { id: string; created_at: Date };

class TestBusiness extends Business<TestFilter, TestEntity> {}

describe('Business', () => {
  it('uses defaults when filters and input filters are not provided', () => {
    const business = new TestBusiness('category');

    expect(business.i18nKey).toBe('category');
    expect(business.INITIAL_FILTERS).toEqual({});
    expect(business.INITIAL_INPUT_FILTERS).toEqual([]);
  });

  it('stores provided initial filters and input filters', () => {
    const inputFilters = [{ name: 'name', label: 'Name', type: 'text', value: '', placeholder: 'Name' }];
    const business = new TestBusiness('category', { name: 'food' }, inputFilters);

    expect(business.INITIAL_FILTERS).toEqual({ name: 'food' });
    expect(business.INITIAL_INPUT_FILTERS).toEqual(inputFilters);
  });

  it('builds i18n response message from action state', () => {
    const business = new TestBusiness('category');

    expect(business.getResponseMessage({ status: 'success', type: 'create', message: '' })).toBe(
      'category.messages.success.create',
    );
  });

  it('returns the original entity by id and undefined for unknown entries', () => {
    const business = new TestBusiness('category');
    const items: Array<TestEntity> = [
      { id: '1', created_at: new Date('2025-01-01T00:00:00.000Z') },
      { id: '2', created_at: new Date('2025-01-02T00:00:00.000Z') },
    ];

    expect(business.getOriginal(items, { id: '2' })).toEqual(items[1]);
    expect(business.getOriginal(items, { id: '3' })).toBeUndefined();
  });
});
