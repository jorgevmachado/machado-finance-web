jest.mock('@/app/shared', () => ({
  createI18nMessage: (key: string) => `i18n:${key}`,
}));

import {
  DEFAULT_LOGIN_ERROR_MESSAGE,
  INVALID_BIRTH_DATE_MESSAGE,
  INVALID_CREDENTIAL_MESSAGE,
  INVALID_EMAIL_MESSAGE,
  INVALID_FULL_NAME_MESSAGE,
  INVALID_GENDER_MESSAGE,
  INVALID_USERNAME_MESSAGE,
  PASSWORD_CONFIRMATION_MESSAGE,
  PASSWORD_RULE_MESSAGE,
} from './messages';

describe('auth messages', () => {
  it('exports expected i18n keys', () => {
    expect(INVALID_CREDENTIAL_MESSAGE).toBe('i18n:auth.errors.invalidCredential');
    expect(INVALID_FULL_NAME_MESSAGE).toBe('i18n:auth.errors.invalidFullName');
    expect(INVALID_BIRTH_DATE_MESSAGE).toBe('i18n:auth.errors.invalidBirthDate');
    expect(INVALID_GENDER_MESSAGE).toBe('i18n:auth.errors.invalidGender');
    expect(INVALID_USERNAME_MESSAGE).toBe('i18n:auth.errors.invalidUsername');
    expect(PASSWORD_CONFIRMATION_MESSAGE).toBe(
      'i18n:auth.errors.passwordConfirmation',
    );
    expect(DEFAULT_LOGIN_ERROR_MESSAGE).toBe('i18n:auth.errors.defaultLogin');
    expect(INVALID_EMAIL_MESSAGE).toBe('i18n:auth.errors.invalidEmail');
    expect(PASSWORD_RULE_MESSAGE).toBe('i18n:auth.errors.passwordRule');
  });
});
