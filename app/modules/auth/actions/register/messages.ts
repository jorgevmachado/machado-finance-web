import { createI18nMessage } from '@/app/shared';

export const DEFAULT_REGISTER_ERROR_MESSAGE = createI18nMessage('auth.register.message.error.default');
export const INVALID_NAME_MESSAGE = createI18nMessage('auth.register.message.error.name');
export const INVALID_EMAIL_MESSAGE = createI18nMessage('auth.register.message.error.email');
export const INVALID_USERNAME_MESSAGE = createI18nMessage('auth.register.message.error.username');
export const PASSWORD_RULE_MESSAGE = createI18nMessage('auth.register.message.error.password');
export const PASSWORD_CONFIRMATION_MESSAGE = createI18nMessage('auth.register.message.error.confirm_password');