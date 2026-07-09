import { toErrorState } from '@/app/modules/actions';

import {
  EXPENSE_INVALID_PAYEE_MESSAGE ,
  EXPENSE_INVALID_DESCRIPTION_MESSAGE ,
  EXPENSE_INVALID_ALLOCATION_MESSAGE,
  EXPENSE_INVALID_CATEGORY_MESSAGE,
} from './messages';
import { validateCreatePayload, validateUpdatePayload } from './validation';

describe('income validation', () => {
  it('validates create payload name', () => {
    expect(
      validateCreatePayload({
        months: [],
        payee: 'ab',
        description: 'Valid description',
        category_id: 'valid-category-id',
        allocation_id: 'valid-account-id',
        reference_year: 2026,
      }),
    ).toEqual(toErrorState(EXPENSE_INVALID_PAYEE_MESSAGE));
  });

  it('validates create payload description', () => {
    expect(
      validateCreatePayload({
        months: [],
        payee: 'Valid name',
        description: 'ab',
        category_id: 'valid-category-id',
        allocation_id: 'valid-account-id',
        reference_year: 2026,
      }),
    ).toEqual(toErrorState(EXPENSE_INVALID_DESCRIPTION_MESSAGE));
  });

  it('validates create payload category_id', () => {
    expect(
      validateCreatePayload({
        months: [],
        payee: 'Valid name',
        category_id: '' as never,
        description: 'Valid description',
        allocation_id: 'valid-account-id',
        reference_year: 2026,
      }),
    ).toEqual(toErrorState(EXPENSE_INVALID_CATEGORY_MESSAGE));
  });

  it('validates create payload allocation_id', () => {
    expect(
      validateCreatePayload({
        months: [],
        payee: 'Valid name',
        category_id: 'valid-category-id',
        description: 'Valid description',
        allocation_id: '' as never,
        reference_year: 2026,
      }),
    ).toEqual(toErrorState(EXPENSE_INVALID_ALLOCATION_MESSAGE));
  });

  it('returns null for valid create payload', () => {
    expect(
      validateCreatePayload({
        months: [],
        payee: 'Valid name',
        description: 'Valid description',
        category_id: 'valid-category-id',
        allocation_id: 'valid-account-id',
        reference_year: 2026,
      }),
    ).toBeNull();
  });

  it('validates update payload payee', () => {
    expect(
      validateUpdatePayload({
        payee: 'ab',
      }),
    ).toEqual(toErrorState(EXPENSE_INVALID_PAYEE_MESSAGE));
  });

  it('validates update payload initial_balance', () => {
    expect(
      validateUpdatePayload({
        description: 'ab',
      }),
    ).toEqual(toErrorState(EXPENSE_INVALID_DESCRIPTION_MESSAGE));
  });

  it('returns null for valid update payload', () => {
    expect(
      validateUpdatePayload({
        payee: 'Valid name',
      }),
    ).toBeNull();
  });
});
