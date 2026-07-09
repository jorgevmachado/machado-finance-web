import { toErrorState } from '@/app/modules/actions';

import {
  ALLOCATION_INVALID_NAME_MESSAGE ,
  ALLOCATION_INVALID_DESCRIPTION_MESSAGE ,
  ALLOCATION_INVALID_ACCOUNT_MESSAGE,
} from './messages';
import { validateCreatePayload, validateUpdatePayload } from './validation';

describe('income validation', () => {
  it('validates create payload name', () => {
    expect(
      validateCreatePayload({
        name: 'ab',
        description: 'Valid description',
        account_id: 'valid-account-id',
      }),
    ).toEqual(toErrorState(ALLOCATION_INVALID_NAME_MESSAGE));
  });

  it('validates create payload description', () => {
    expect(
      validateCreatePayload({
        name: 'Valid name',
        description: 'ab',
        account_id: 'valid-account-id',
      }),
    ).toEqual(toErrorState(ALLOCATION_INVALID_DESCRIPTION_MESSAGE));
  });

  it('validates create payload account_id', () => {
    expect(
      validateCreatePayload({
        name: 'Valid name',
        description: 'ab',
        account_id: '' as never,
      }),
    ).toEqual(toErrorState(ALLOCATION_INVALID_ACCOUNT_MESSAGE));
  });

  it('returns null for valid create payload', () => {
    expect(
      validateCreatePayload({
        name: 'Valid name',
        description: 'Valid description',
        account_id: 'valid-account-id',
      }),
    ).toBeNull();
  });

  it('validates update payload name', () => {
    expect(
      validateUpdatePayload({
        name: 'ab',
      }),
    ).toEqual(toErrorState(ALLOCATION_INVALID_NAME_MESSAGE));
  });

  it('validates update payload initial_balance', () => {
    expect(
      validateUpdatePayload({
        description: 'ab',
      }),
    ).toEqual(toErrorState(ALLOCATION_INVALID_DESCRIPTION_MESSAGE));
  });

  it('returns null for valid update payload', () => {
    expect(
      validateUpdatePayload({
        name: 'Valid name',
      }),
    ).toBeNull();
  });
});
