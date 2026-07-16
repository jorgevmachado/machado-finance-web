'use server';
import { redirect } from 'next/navigation';

import { ActionState } from '@/app/actions';

import {
  mapLoginError,
  readLoginPayload,
  validateLoginPayload
} from './validation';
import { authService } from '../../service';

import { setAuthCookie } from '../../server/session';


export async function loginAction(_: ActionState, formData: FormData): Promise<ActionState> {
  const credentials = readLoginPayload(formData);
  const validationError = validateLoginPayload(credentials);

  if (validationError) {
    return validationError;
  }

  try {
    const service = authService();
    const token = await service.login(credentials);

    await setAuthCookie(token);
  } catch (error) {
    return mapLoginError(error);
  }

  redirect('/home');
}
