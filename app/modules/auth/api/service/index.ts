import { AuthService } from './service';
import { getBaseUrl } from '@/app/shared';

export const authService = (token?: string): AuthService => {
  return new AuthService(getBaseUrl(), token);
};