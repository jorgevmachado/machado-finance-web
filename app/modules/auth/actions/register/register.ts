import {
  type ActionState ,
  getStringValue ,
  toErrorState ,
} from '@/app/shared/actions';

import {
  INVALID_BIRTH_DATE_MESSAGE ,
  INVALID_EMAIL_MESSAGE ,
  INVALID_FULL_NAME_MESSAGE ,
  INVALID_GENDER_MESSAGE ,
  INVALID_USERNAME_MESSAGE ,
  PASSWORD_CONFIRMATION_MESSAGE ,
  PASSWORD_RULE_MESSAGE ,
} from '../messages';

import type { RegisterUserPayload } from './types';

import { isStrongPassword } from '../../validation';

export const readRegisterPayload = (formData: FormData): RegisterUserPayload => {
  return {
    email: getStringValue(formData ,'email') ,
    username: getStringValue(formData ,'username') ,
    fullName: getStringValue(formData ,'fullName') ,
    birthDate: getStringValue(formData ,'birthDate') ,
    gender: getStringValue(formData ,'gender') ,
    password: getStringValue(formData ,'password') ,
    confirmPassword: getStringValue(formData ,'confirmPassword') ,
  };
};

export const validateRegisterPayload = ({
  email ,
  username ,
  fullName ,
  birthDate ,
  gender ,
  password ,
  confirmPassword ,
}: RegisterUserPayload): ActionState | null => {
  if (!fullName || fullName.length < 3) {
    return toErrorState(INVALID_FULL_NAME_MESSAGE);
  }

  if (!email?.includes('@')) {
    return toErrorState(INVALID_EMAIL_MESSAGE);
  }

  if (!username || username.length === 0) {
    return toErrorState(INVALID_USERNAME_MESSAGE);
  }

  if (!birthDate) {
    return toErrorState(INVALID_BIRTH_DATE_MESSAGE);
  }

  if (!gender) {
    return toErrorState(INVALID_GENDER_MESSAGE);
  }

  if (!isStrongPassword(password)) {
    return toErrorState(PASSWORD_RULE_MESSAGE);
  }

  if (password !== confirmPassword) {
    return toErrorState(PASSWORD_CONFIRMATION_MESSAGE);
  }

  return null;
};