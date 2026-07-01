import { toErrorState } from '@/app/modules/actions';

import {
  CATEGORY_INVALID_DESCRIPTION_MESSAGE,
  CATEGORY_INVALID_NAME_MESSAGE,
  CATEGORY_INVALID_TYPE_MESSAGE,
} from './messages';
import { validateCreatePayload, validateUpdatePayload } from './validation';

describe('category validation', () => {
  it('validates create payload name', () => {
    expect(
      validateCreatePayload({
        name: 'ab',
        type: 'FOOD',
        description: 'valid description',
      }),
    ).toEqual(toErrorState(CATEGORY_INVALID_NAME_MESSAGE));
  });

  it('validates create payload type', () => {
    expect(
      validateCreatePayload({
        name: 'Valid name',
        type: '' as never,
        description: 'valid description',
      }),
    ).toEqual(toErrorState(CATEGORY_INVALID_TYPE_MESSAGE));
  });

  it('validates create payload description', () => {
    expect(
      validateCreatePayload({
        name: 'Valid name',
        type: 'FOOD',
        description: 'ab',
      }),
    ).toEqual(toErrorState(CATEGORY_INVALID_DESCRIPTION_MESSAGE));
  });

  it('returns null for valid create payload', () => {
    expect(
      validateCreatePayload({
        name: 'Valid name',
        type: 'FOOD',
        description: 'Valid description',
      }),
    ).toBeNull();
  });

  it('validates update payload name', () => {
    expect(
      validateUpdatePayload({
        name: 'ab',
      }),
    ).toEqual(toErrorState(CATEGORY_INVALID_NAME_MESSAGE));
  });

  it('validates update payload description', () => {
    expect(
      validateUpdatePayload({
        description: 'ab',
      }),
    ).toEqual(toErrorState(CATEGORY_INVALID_DESCRIPTION_MESSAGE));
  });

  it('returns null for valid update payload', () => {
    expect(
      validateUpdatePayload({
        name: 'Valid name',
        description: 'Valid description',
      }),
    ).toBeNull();
  });
});
