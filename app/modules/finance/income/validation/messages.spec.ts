import {
  INCOME_DEFAULT_CREATE_ERROR_MESSAGE ,
  INCOME_DEFAULT_UPDATE_ERROR_MESSAGE ,
  INCOME_INVALID_SOURCE_MESSAGE ,
  INCOME_INVALID_ACCOUNT_MESSAGE ,INCOME_INVALID_DESCRIPTION_MESSAGE ,
} from './messages';

describe('account validation messages', () => {
  it('exports expected i18n keys', () => {
    expect(INCOME_INVALID_SOURCE_MESSAGE).toBe('i18n:income.errors.invalidSource');
    expect(INCOME_INVALID_ACCOUNT_MESSAGE).toBe('i18n:account.errors.invalidAccount');
    expect(INCOME_INVALID_DESCRIPTION_MESSAGE).toBe(
      'i18n:income.errors.invalidDescription',
    );
    expect(INCOME_DEFAULT_CREATE_ERROR_MESSAGE).toBe(
      'i18n:income.errors.defaultCreate',
    );
    expect(INCOME_DEFAULT_UPDATE_ERROR_MESSAGE).toBe(
      'i18n:income.errors.defaultUpdate',
    );
  });
});
