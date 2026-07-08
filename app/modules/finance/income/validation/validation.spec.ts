import { toErrorState } from '@/app/modules/actions';

import {
  INCOME_INVALID_SOURCE_MESSAGE ,
  INCOME_INVALID_DESCRIPTION_MESSAGE ,
  INCOME_INVALID_ACCOUNT_MESSAGE,
} from './messages';
import { validateCreatePayload, validateUpdatePayload } from './validation';

describe('income validation', () => {
  it('validates create payload name', () => {
    expect(
      validateCreatePayload({
        months: [],
        source: 'ab',
        description: 'Valid description',
        account_id: 'valid-account-id',
        reference_year: 2026,
      }),
    ).toEqual(toErrorState(INCOME_INVALID_SOURCE_MESSAGE));
  });

  it('validates create payload description', () => {
    expect(
      validateCreatePayload({
        months: [],
        source: 'Valid name',
        description: 'ab',
        account_id: 'valid-account-id',
        reference_year: 2026,
      }),
    ).toEqual(toErrorState(INCOME_INVALID_DESCRIPTION_MESSAGE));
  });

  it('validates create payload account_id', () => {
    expect(
      validateCreatePayload({
        months: [],
        source: 'Valid name',
        description: 'ab',
        account_id: '' as never,
        reference_year: 2026,
      }),
    ).toEqual(toErrorState(INCOME_INVALID_ACCOUNT_MESSAGE));
  });

  it('returns null for valid create payload', () => {
    expect(
      validateCreatePayload({
        months: [],
        source: 'Valid name',
        description: 'Valid description',
        account_id: 'valid-account-id',
        reference_year: 2026,
      }),
    ).toBeNull();
  });

  it('validates update payload source', () => {
    expect(
      validateUpdatePayload({
        source: 'ab',
      }),
    ).toEqual(toErrorState(INCOME_INVALID_SOURCE_MESSAGE));
  });

  it('validates update payload initial_balance', () => {
    expect(
      validateUpdatePayload({
        description: 'ab',
      }),
    ).toEqual(toErrorState(INCOME_INVALID_DESCRIPTION_MESSAGE));
  });

  it('returns null for valid update payload', () => {
    expect(
      validateUpdatePayload({
        source: 'Valid name',
      }),
    ).toBeNull();
  });
});
