import { ResponseError } from '@/app/shared';

import type { SignInParams } from '../../types';
import { isStrongPassword } from '../../validation';

import {
  type ActionState ,
  getStringValue ,
  toErrorState,
} from '../../../../actions';

import {
  DEFAULT_LOGIN_ERROR_MESSAGE ,
  INVALID_CREDENTIAL_MESSAGE ,
  PASSWORD_RULE_MESSAGE ,
} from '../messages';

export const readLoginPayload = (formData: FormData): SignInParams => {
  return {
    credential: getStringValue(formData, 'credential'),
    password: getStringValue(formData, 'password'),
  };
};

export const validateLoginPayload = ({ credential, password }: SignInParams): ActionState | null => {
  if (!credential || credential.length === 0) {
    return toErrorState(INVALID_CREDENTIAL_MESSAGE);
  }

  if (!isStrongPassword(password)) {
    return toErrorState(PASSWORD_RULE_MESSAGE);
  }

  return null;
};

export const mapLoginError = (error: unknown): ActionState => {
  const responseError = error as ResponseError | undefined;
  const message = responseError?.message || DEFAULT_LOGIN_ERROR_MESSAGE;

  return toErrorState(message);
};