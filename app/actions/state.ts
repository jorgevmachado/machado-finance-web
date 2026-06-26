import { createI18nMessage ,ResponseError } from '@/app/shared';

export type ActionStateType = 'create' | 'update' | 'delete' | 'other';

export type ActionStateStatus = 'error' | 'idle' | 'cancel' | 'success' | 'unknown';

export type ActionState = {
  item?: unknown;
  type:  ActionStateType;
  status: ActionStateStatus;
  message: string;
};

export const INITIAL_ACTION_STATE: ActionState = {
  type: 'other',
  status: 'idle',
  message: '',
};

export const UNAUTHORIZED_ERROR_MESSAGE = createI18nMessage('auth.errors.accessDenied');

export const getStringValue = (formData: FormData, key: string): string => {
  const value = formData.get(key);

  return typeof value === 'string' ? value.trim() : '';
};

export const toErrorState = (message: string, type:  ActionStateType = 'other'): ActionState => {
  return {
    type,
    status: 'error',
    message,
  };
};

export const mapError = (error: unknown, defaultErrorMessage: string): ActionState => {
  const responseError = error as ResponseError | undefined;
  const message = responseError?.message || defaultErrorMessage;

  return toErrorState(message);
};