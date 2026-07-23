import type { SignUpParams } from '../../types';

export type RegisterUserPayload = SignUpParams & {
  confirmPassword: string;
};