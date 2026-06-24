export type StatusEnum = 'ACTIVE' | 'INACTIVE';
export type RoleEnum = 'USER' | 'ADMIN';

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
  status: StatusEnum;
}

export type TUser = {
  id: string;
  name: string;
  email: string;
  username: string;
  status: StatusEnum;
  role: RoleEnum;
  created_at: string;
  updated_at?: string;
  deleted_at?: string;
};