import {
  ALLOCATION_DEFAULT_CREATE_ERROR_MESSAGE ,
  ALLOCATION_DEFAULT_UPDATE_ERROR_MESSAGE ,
  ALLOCATION_INVALID_NAME_MESSAGE ,
  ALLOCATION_INVALID_ACCOUNT_MESSAGE ,
  ALLOCATION_INVALID_DESCRIPTION_MESSAGE ,
} from './messages';

describe('account validation messages', () => {
  it('exports expected i18n keys', () => {
    expect(ALLOCATION_INVALID_NAME_MESSAGE).toBe('i18n:allocation.errors.invalidName');
    expect(ALLOCATION_INVALID_ACCOUNT_MESSAGE).toBe('i18n:account.errors.invalidAccount');
    expect(ALLOCATION_INVALID_DESCRIPTION_MESSAGE).toBe(
      'i18n:allocation.errors.invalidDescription',
    );
    expect(ALLOCATION_DEFAULT_CREATE_ERROR_MESSAGE).toBe(
      'i18n:allocation.errors.defaultCreate',
    );
    expect(ALLOCATION_DEFAULT_UPDATE_ERROR_MESSAGE).toBe(
      'i18n:allocation.errors.defaultUpdate',
    );
  });
});
