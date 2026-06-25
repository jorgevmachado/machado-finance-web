import { createI18nMessage ,ResponseError } from '@/app/shared';

export type ActionState = {
  item?: unknown;
  status: 'idle' | 'success' | 'error';
  message: string;
};

export const INITIAL_ACTION_STATE: ActionState = {
  status: 'idle',
  message: '',
};

export const UNAUTHORIZED_ERROR_MESSAGE = createI18nMessage('auth.errors.accessDenied');

export const getStringValue = (formData: FormData, key: string): string => {
  const value = formData.get(key);

  return typeof value === 'string' ? value.trim() : '';
};

export const toErrorState = (message: string): ActionState => {
  return {
    status: 'error',
    message,
  };
};

export const mapError = (error: unknown, defaultErrorMessage: string): ActionState => {
  const responseError = error as ResponseError | undefined;
  const message = responseError?.message || defaultErrorMessage;

  return toErrorState(message);
};