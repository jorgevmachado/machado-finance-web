'use server';
import { clearAuthCookie } from '../../server/session';

export async function logoutAction(): Promise<void> {
  await clearAuthCookie();
}