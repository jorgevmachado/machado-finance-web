import { ResponseError } from '@/app/shared';

import {
  type ActionState ,
  getStringValue ,
  toErrorState ,
} from '@/app/shared/actions';

import type { RegisterUserPayload } from './types';

import { isStrongPassword } from '../../validation';
import {
  INVALID_NAME_MESSAGE,
  INVALID_EMAIL_MESSAGE ,
  INVALID_USERNAME_MESSAGE ,
  PASSWORD_RULE_MESSAGE ,
  PASSWORD_CONFIRMATION_MESSAGE ,
  DEFAULT_REGISTER_ERROR_MESSAGE,

} from './messages';

export const readRegisterPayload = (formData: FormData): RegisterUserPayload => {
  return {
    name: getStringValue(formData ,'name') ,
    email: getStringValue(formData ,'email') ,
    username: getStringValue(formData ,'username') ,
    password: getStringValue(formData ,'password') ,
    confirmPassword: getStringValue(formData ,'confirmPassword') ,
  };
};

export const validateRegisterPayload = ({
  name,
  email ,
  username ,
  password ,
  confirmPassword ,
}: RegisterUserPayload): ActionState | null => {
  if (!name || name.length < 3) {
    return toErrorState(INVALID_NAME_MESSAGE);
  }

  if (!email?.includes('@')) {
    return toErrorState(INVALID_EMAIL_MESSAGE);
  }

  if (!username || username.length === 0) {
    return toErrorState(INVALID_USERNAME_MESSAGE);
  }

  if (!isStrongPassword(password)) {
    return toErrorState(PASSWORD_RULE_MESSAGE);
  }

  if (password !== confirmPassword) {
    return toErrorState(PASSWORD_CONFIRMATION_MESSAGE);
  }

  return null;
};

export const mapRegisterError = (error: unknown): ActionState => {
  const responseError = error as ResponseError | undefined;
  const message = responseError?.message || DEFAULT_REGISTER_ERROR_MESSAGE;
  return toErrorState(message);
};