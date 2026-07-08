import {
  ACCOUNT_DEFAULT_CREATE_ERROR_MESSAGE ,
  ACCOUNT_DEFAULT_UPDATE_ERROR_MESSAGE ,
  ACCOUNT_INVALID_INITIAL_BALANCE_MESSAGE ,
  ACCOUNT_INVALID_NAME_MESSAGE ,
  ACCOUNT_INVALID_TYPE_MESSAGE ,
} from './messages';

describe('account validation messages', () => {
  it('exports expected i18n keys', () => {
    expect(ACCOUNT_INVALID_NAME_MESSAGE).toBe('i18n:account.errors.invalidName');
    expect(ACCOUNT_INVALID_TYPE_MESSAGE).toBe('i18n:account.errors.invalidType');
    expect(ACCOUNT_INVALID_INITIAL_BALANCE_MESSAGE).toBe(
      'i18n:account.errors.invalidInitialBalance',
    );
    expect(ACCOUNT_DEFAULT_CREATE_ERROR_MESSAGE).toBe(
      'i18n:account.errors.defaultCreate',
    );
    expect(ACCOUNT_DEFAULT_UPDATE_ERROR_MESSAGE).toBe(
      'i18n:account.errors.defaultUpdate',
    );
  });
});
