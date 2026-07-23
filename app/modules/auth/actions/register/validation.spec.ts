import { toErrorState } from '@/app/shared/actions';

import {
  DEFAULT_REGISTER_ERROR_MESSAGE ,
  INVALID_EMAIL_MESSAGE ,
  INVALID_NAME_MESSAGE ,
  INVALID_USERNAME_MESSAGE ,
  PASSWORD_CONFIRMATION_MESSAGE ,
  PASSWORD_RULE_MESSAGE ,
} from './messages';
import {
  mapRegisterError,
  readRegisterPayload,
  validateRegisterPayload,
} from './validation';


const validPayload = {
  name: 'John Doe',
  email: 'user@example.com',
  username: 'johndoe',
  password: 'Secure@123',
  confirmPassword: 'Secure@123',
};

describe('auth Register validation', () => {
  it('reads payload from form data with trim', () => {
    const formData = new FormData();
    formData.set('name', ' John Doe ');
    formData.set('email', ' user@example.com ');
    formData.set('username', ' johndoe ');
    formData.set('password', ' Secure@123 ');
    formData.set('confirmPassword', ' Secure@123 ');

    expect(readRegisterPayload(formData)).toEqual(validPayload);
  });

  it('returns email error when email is invalid', () => {
    expect(
      validateRegisterPayload({
        ...validPayload,
        email: 'invalid-email',
      }),
    ).toEqual(toErrorState(INVALID_EMAIL_MESSAGE));
  });

  it('returns name error when name is invalid', () => {
    expect(
      validateRegisterPayload({
        ...validPayload,
        name: 'Jo',
      }),
    ).toEqual(toErrorState(INVALID_NAME_MESSAGE));
  });

  it('returns name error when username is invalid', () => {
    expect(
      validateRegisterPayload({
        ...validPayload,
        username: '',
      }),
    ).toEqual(toErrorState(INVALID_USERNAME_MESSAGE));
  });

  it('returns password error when password is weak', () => {
    expect(
      validateRegisterPayload({
        ...validPayload,
        password: 'weak',
      }),
    ).toEqual(toErrorState(PASSWORD_RULE_MESSAGE));
  });

  it('returns password confirmation error when password confirmation does not match', () => {
    expect(
      validateRegisterPayload({
        ...validPayload,
        confirmPassword: 'different',
      }),
    ).toEqual(toErrorState(PASSWORD_CONFIRMATION_MESSAGE));
  });

  it('returns null when payload is valid', () => {
    expect(validateRegisterPayload(validPayload)).toBeNull();
  });

  it('maps response error message when available', () => {
    expect(
      mapRegisterError({
        message: 'custom error',
        statusCode: 401,
        error: 'custom',
      }),
    ).toEqual(toErrorState('custom error'));
  });

  it('maps unknown error to default message', () => {
    expect(mapRegisterError(undefined)).toEqual(
      toErrorState(DEFAULT_REGISTER_ERROR_MESSAGE),
    );
  });
});
