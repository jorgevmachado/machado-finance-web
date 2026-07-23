import { createI18nMessage ,createActionMessages ,ResponseError } from '@/app/shared';

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

export const UNAUTHORIZED_ERROR_MESSAGE = createI18nMessage('auth.unauthorized');

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

export const mapError = (error: unknown, i18nKey: string, type:  ActionStateType): ActionState => {
  const responseError = error as ResponseError | undefined;
  const message = responseError?.message || createActionMessages(i18nKey, type, 'error');

  return toErrorState(message);
};

export const createState = (i18nKey: string, type:  ActionStateType, status: ActionStateStatus): ActionState => {
  const message = createActionMessages(i18nKey, type, status);
  
  return {  
    type,
    status,
    message,
  };
};