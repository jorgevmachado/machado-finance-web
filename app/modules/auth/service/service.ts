import { ApiBaseServiceAbstract } from '@/app/shared';

import { extractAuthToken } from '../token';

import type { LoginResponsePayload , RegisterResponse , SignInParams , SignUpParams , TUser } from '../types';

export class AuthService extends ApiBaseServiceAbstract<TUser, unknown, unknown> {

  constructor(baseUrl: string ,token?: string) {
    super(baseUrl ,'auth' ,token);
  }

  public async login(params: SignInParams): Promise<string> {
    const response = await this.post<SignInParams ,LoginResponsePayload>(
      `${ this.pathUrl }/login` ,{
        body: params ,
      });

    return extractAuthToken(response);
  }

  public async me(): Promise<TUser> {
    return await this.get<TUser>(`${ this.pathUrl }/me`);
  }

  public async register(payload: SignUpParams): Promise<RegisterResponse> {
    return await this.post<SignUpParams ,RegisterResponse>(
      `${ this.pathUrl }/register` ,{
        body: payload ,
      });
  }
}