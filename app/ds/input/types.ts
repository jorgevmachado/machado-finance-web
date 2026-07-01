import { type ChangeEvent, type InputHTMLAttributes, type ReactNode } from 'react';
import { type SupportedLocale } from '@/app/shared';

export type InputVariant = 'outline' | 'filled' | 'ghost';

export type InputSize = 'sm' | 'md' | 'lg';
export type InputMask = string | ((value: string) => string);
export type InputType = InputHTMLAttributes<HTMLInputElement>['type'] | 'money';
export type InputMoneyLocale = Extract<SupportedLocale, 'pt-BR' | 'en'>;

export type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'> & {
  label?: string;
  variant?: InputVariant;
  size?: InputSize;
  type?: InputType;
  isInvalid?: boolean;
  isLoading?: boolean;
  loadingText?: string;
  helperText?: ReactNode;
  errorMessage?: ReactNode;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
  fullWidth?: boolean;
  showClearButton?: boolean;
  clearButtonAriaLabel?: string;
  onClear?: () => void;
  onValueChange?: (value: string, event: ChangeEvent<HTMLInputElement>) => void;
  mask?: InputMask;
  switchLanguage?: InputMoneyLocale;
  containerClassName?: string;
  inputWrapperClassName?: string;
  helperClassName?: string;
};
