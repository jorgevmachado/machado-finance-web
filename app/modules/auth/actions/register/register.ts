'use server';
import { ActionState ,createState } from '@/app/shared/actions';
import {
  mapRegisterError,
  readRegisterPayload ,
  validateRegisterPayload,
} from './validation';
import { authService } from '../../api/service';

export async function registerAction(_: ActionState, formData: FormData): Promise<ActionState> {
  const payload = readRegisterPayload(formData);
  const validationError = validateRegisterPayload(payload);
  
  if (validationError) {
    return validationError;
  }


  try {
    const service = authService();
    await service.register({
      name: payload.name,
      email: payload.email,
      username: payload.username,
      password: payload.password,
    });
  } catch (error) {
    return mapRegisterError(error);
  }

  return createState('auth', 'create', 'success');
}