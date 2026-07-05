import type { TEntity } from '@/app/modules';
import type { TFinance } from '@/app/modules/finance';

import { EUserRole ,EUserStatus } from './enum';

export type LoginResponsePayload = {
  token_type: string;
  access_token: string;
}

export type SignInParams = {
  credential: string;
  password: string;
}

export type SignUpParams = {
  name: string;
  email: string;
  username: string;
  password: string;
}

export type RegisterResponse = {
  id: string;
  name: string;
  email: string;
  status: EUserStatus;
}

export type TUser = TEntity & {
  role: EUserRole;
  name: string;
  email: string;
  status: EUserStatus;
  finance?: TFinance;
  username: string;
};