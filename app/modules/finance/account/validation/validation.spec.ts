import { toErrorState } from '@/app/modules/actions';

import {
  ACCOUNT_INVALID_INITIAL_BALANCE_MESSAGE ,
  ACCOUNT_INVALID_NAME_MESSAGE ,
  ACCOUNT_INVALID_TYPE_MESSAGE ,
} from './messages';
import { validateCreatePayload, validateUpdatePayload } from './validation';

describe('account validation', () => {
  it('validates create payload name', () => {
    expect(
      validateCreatePayload({
        name: 'ab',
        type: 'BANK',
        initial_balance: 0,
      }),
    ).toEqual(toErrorState(ACCOUNT_INVALID_NAME_MESSAGE));
  });

  it('validates create payload type', () => {
    expect(
      validateCreatePayload({
        name: 'Valid name',
        type: '' as never,
        initial_balance: 0,
      }),
    ).toEqual(toErrorState(ACCOUNT_INVALID_TYPE_MESSAGE));
  });

  it('validates create payload initial_balance', () => {
    expect(
      validateCreatePayload({
        name: 'Valid name',
        type: 'BANK',
        initial_balance: -1,
      }),
    ).toEqual(toErrorState(ACCOUNT_INVALID_INITIAL_BALANCE_MESSAGE));
  });

  it('returns null for valid create payload', () => {
    expect(
      validateCreatePayload({
        name: 'Valid name',
        type: 'BANK',
        initial_balance: 0,
      }),
    ).toBeNull();
  });

  it('validates update payload name', () => {
    expect(
      validateUpdatePayload({
        name: 'ab',
      }),
    ).toEqual(toErrorState(ACCOUNT_INVALID_NAME_MESSAGE));
  });

  it('validates update payload initial_balance', () => {
    expect(
      validateUpdatePayload({
        initial_balance: -1,
      }),
    ).toEqual(toErrorState(ACCOUNT_INVALID_INITIAL_BALANCE_MESSAGE));
  });

  it('returns null for valid update payload', () => {
    expect(
      validateUpdatePayload({
        name: 'Valid name',
      }),
    ).toBeNull();
  });
});
