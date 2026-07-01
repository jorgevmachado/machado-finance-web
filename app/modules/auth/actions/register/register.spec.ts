import { toErrorState } from '@/app/modules/actions';

import {
  INVALID_BIRTH_DATE_MESSAGE,
  INVALID_EMAIL_MESSAGE,
  INVALID_FULL_NAME_MESSAGE,
  INVALID_GENDER_MESSAGE,
  INVALID_USERNAME_MESSAGE,
  PASSWORD_CONFIRMATION_MESSAGE,
  PASSWORD_RULE_MESSAGE,
} from '../messages';
import { readRegisterPayload, validateRegisterPayload } from './register';

const validPayload = {
  email: 'user@example.com',
  username: 'johndoe',
  fullName: 'John Doe',
  birthDate: '1990-01-01',
  gender: 'male',
  password: 'Secure@123',
  confirmPassword: 'Secure@123',
};

describe('auth register helpers', () => {
  it('reads payload from form data', () => {
    const formData = new FormData();
    formData.set('email', ' user@example.com ');
    formData.set('username', ' johndoe ');
    formData.set('fullName', ' John Doe ');
    formData.set('birthDate', '1990-01-01');
    formData.set('gender', 'male');
    formData.set('password', ' Secure@123 ');
    formData.set('confirmPassword', ' Secure@123 ');

    expect(readRegisterPayload(formData)).toEqual(validPayload);
  });

  it('returns full name error', () => {
    expect(
      validateRegisterPayload({
        ...validPayload,
        fullName: 'Jo',
      }),
    ).toEqual(toErrorState(INVALID_FULL_NAME_MESSAGE));
  });

  it('returns email error', () => {
    expect(
      validateRegisterPayload({
        ...validPayload,
        email: 'invalid-email',
      }),
    ).toEqual(toErrorState(INVALID_EMAIL_MESSAGE));
  });

  it('returns username error', () => {
    expect(
      validateRegisterPayload({
        ...validPayload,
        username: '',
      }),
    ).toEqual(toErrorState(INVALID_USERNAME_MESSAGE));
  });

  it('returns birth date error', () => {
    expect(
      validateRegisterPayload({
        ...validPayload,
        birthDate: '',
      }),
    ).toEqual(toErrorState(INVALID_BIRTH_DATE_MESSAGE));
  });

  it('returns gender error', () => {
    expect(
      validateRegisterPayload({
        ...validPayload,
        gender: '',
      }),
    ).toEqual(toErrorState(INVALID_GENDER_MESSAGE));
  });

  it('returns password rule error', () => {
    expect(
      validateRegisterPayload({
        ...validPayload,
        password: 'weak',
        confirmPassword: 'weak',
      }),
    ).toEqual(toErrorState(PASSWORD_RULE_MESSAGE));
  });

  it('returns password confirmation error', () => {
    expect(
      validateRegisterPayload({
        ...validPayload,
        confirmPassword: 'Secure@124',
      }),
    ).toEqual(toErrorState(PASSWORD_CONFIRMATION_MESSAGE));
  });

  it('returns null for valid payload', () => {
    expect(validateRegisterPayload(validPayload)).toBeNull();
  });
});
