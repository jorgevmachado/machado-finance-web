import { toErrorState } from '@/app/shared/actions';

import {
  DEFAULT_LOGIN_ERROR_MESSAGE,
  INVALID_CREDENTIAL_MESSAGE,
  PASSWORD_RULE_MESSAGE,
} from '../messages';
import {
  mapLoginError,
  readLoginPayload,
  validateLoginPayload,
} from './validation';

describe('auth login validation', () => {
  it('reads credential and password from form data with trim', () => {
    const formData = new FormData();
    formData.set('credential', '  user@example.com  ');
    formData.set('password', '  Secure@123  ');

    expect(readLoginPayload(formData)).toEqual({
      credential: 'user@example.com',
      password: 'Secure@123',
    });
  });

  it('returns credential error when credential is empty', () => {
    expect(
      validateLoginPayload({
        credential: '',
        password: 'Secure@123',
      }),
    ).toEqual(toErrorState(INVALID_CREDENTIAL_MESSAGE));
  });

  it('returns password error when password is weak', () => {
    expect(
      validateLoginPayload({
        credential: 'user@example.com',
        password: 'weak',
      }),
    ).toEqual(toErrorState(PASSWORD_RULE_MESSAGE));
  });

  it('returns null when payload is valid', () => {
    expect(
      validateLoginPayload({
        credential: 'user@example.com',
        password: 'Secure@123',
      }),
    ).toBeNull();
  });

  it('maps response error message when available', () => {
    expect(
      mapLoginError({
        message: 'custom error',
        statusCode: 401,
        error: 'custom',
      }),
    ).toEqual(toErrorState('custom error'));
  });

  it('maps unknown error to default message', () => {
    expect(mapLoginError(undefined)).toEqual(
      toErrorState(DEFAULT_LOGIN_ERROR_MESSAGE),
    );
  });
});
