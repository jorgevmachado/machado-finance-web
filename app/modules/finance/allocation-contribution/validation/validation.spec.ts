import { toErrorState } from '@/app/modules/actions';

import {
  ALLOCATION_CONTRIBUTION_INVALID_CONTRIBUTOR_NAME_MESSAGE ,
  ALLOCATION_CONTRIBUTION_INVALID_DESCRIPTION_MESSAGE ,
  ALLOCATION_CONTRIBUTION_INVALID_ALLOCATION_MESSAGE,
} from './messages';
import { validateCreatePayload, validateUpdatePayload } from './validation';

describe('Allocation Contribution validation', () => {
  it('validates create payload name', () => {
    expect(
      validateCreatePayload({
        months: [],
        description: 'Valid description',
        allocation_id: 'valid-account-id',
        reference_year: 2026,
        contributor_name: 'ab',
      }),
    ).toEqual(toErrorState(ALLOCATION_CONTRIBUTION_INVALID_CONTRIBUTOR_NAME_MESSAGE));
  });

  it('validates create payload description', () => {
    expect(
      validateCreatePayload({
        months: [],
        description: 'ab',
        allocation_id: 'valid-account-id',
        reference_year: 2026,
        contributor_name: 'Valid name',
      }),
    ).toEqual(toErrorState(ALLOCATION_CONTRIBUTION_INVALID_DESCRIPTION_MESSAGE));
  });

  it('validates create payload allocation_id', () => {
    expect(
      validateCreatePayload({
        months: [],
        description: 'Valid description',
        allocation_id: '' as never,
        reference_year: 2026,
        contributor_name: 'Valid name',
      }),
    ).toEqual(toErrorState(ALLOCATION_CONTRIBUTION_INVALID_ALLOCATION_MESSAGE));
  });

  it('returns null for valid create payload', () => {
    expect(
      validateCreatePayload({
        months: [],
        description: 'Valid description',
        allocation_id: 'valid-account-id',
        reference_year: 2026,
        contributor_name: 'Valid name',
      }),
    ).toBeNull();
  });

  it('validates update payload payee', () => {
    expect(
      validateUpdatePayload({
        contributor_name: 'ab',
      }),
    ).toEqual(toErrorState(ALLOCATION_CONTRIBUTION_INVALID_CONTRIBUTOR_NAME_MESSAGE));
  });

  it('validates update payload description', () => {
    expect(
      validateUpdatePayload({
        description: 'ab',
      }),
    ).toEqual(toErrorState(ALLOCATION_CONTRIBUTION_INVALID_DESCRIPTION_MESSAGE));
  });

  it('returns null for valid update payload', () => {
    expect(
      validateUpdatePayload({
        contributor_name: 'Valid name',
      }),
    ).toBeNull();
  });
});
