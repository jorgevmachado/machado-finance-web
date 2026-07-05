'use client';

import React, { useCallback, useMemo } from 'react';

import { MdClose } from 'react-icons/md';

import { joinClass } from '@/app/utils';

import { type InputProps, type InputSize, type InputVariant } from './types';
import { Text } from '@/app/ds';

const VARIANT_CLASS_MAP: Record<InputVariant, string> = {
  outline: 'border border-slate-200 bg-white text-slate-700 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100',
  filled: 'border border-transparent bg-slate-100 text-slate-800 focus-within:border-blue-300 focus-within:ring-2 focus-within:ring-blue-100',
  ghost: 'border border-transparent bg-transparent text-slate-700 focus-within:border-blue-300 focus-within:ring-2 focus-within:ring-blue-100',
};

const SIZE_CLASS_MAP: Record<InputSize, string> = {
  sm: 'h-9 text-sm',
  md: 'h-10 text-sm',
  lg: 'h-11 text-base',
};

const CURRENCY_LANGUAGE_MAP = {
  'pt-BR': { locale: 'pt-BR', currency: 'BRL' },
  en: { locale: 'en-US', currency: 'USD' },
  es: { locale: 'es-ES', currency: 'EUR' },
} as const;

const MASK_TOKEN = '#';

function applyStringMask(rawValue: string, maskPattern: string): string {
  const onlyDigits = rawValue.replace(/\D/g, '');

  if (!onlyDigits) {
    return '';
  }

  let digitIndex = 0;
  let maskedValue = '';

  for (const character of maskPattern) {
    if (character === MASK_TOKEN) {
      if (digitIndex >= onlyDigits.length) {
        break;
      }
      maskedValue += onlyDigits[digitIndex];
      digitIndex += 1;
      continue;
    }

    if (digitIndex < onlyDigits.length) {
      maskedValue += character;
    } else {
      break;
    }
  }

  return maskedValue;
}

function applyMask(rawValue: string, mask?: InputProps['mask']): string {
  if (!mask) {
    return rawValue;
  }

  if (typeof mask === 'function') {
    return mask(rawValue);
  }

  return applyStringMask(rawValue, mask);
}

function formatMoney(rawValue: string, switchLanguage: InputProps['switchLanguage']): string {
  const onlyDigits = rawValue.replace(/\D/g, '');

  if (!onlyDigits) {
    return '';
  }

  const mappedLocale = CURRENCY_LANGUAGE_MAP[switchLanguage ?? 'pt-BR'];
  const value = Number.parseInt(onlyDigits, 10) / 100;

  return new Intl.NumberFormat(mappedLocale.locale, {
    style: 'currency',
    currency: mappedLocale.currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
    .format(value)
    .replace(/\u00A0/g, ' ');
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(({
  label,
  variant = 'outline',
  size = 'md',
  isInvalid = false,
  isLoading = false,
  loadingText,
  helperText,
  errorMessage,
  leadingIcon,
  trailingIcon,
  fullWidth = true,
  showClearButton = false,
  clearButtonAriaLabel = 'Clear input',
  onClear,
  onValueChange,
  onChange,
  disabled,
  readOnly,
  value,
  type = 'text',
  mask,
  switchLanguage = 'pt-BR',
  placeholder,
  containerClassName,
  inputWrapperClassName,
  helperClassName,
  className,
  ...inputProps
}, ref) => {
  const hasValue = typeof value === 'string' && value.length > 0;
  const isMoneyInput = type === 'money';

  const formattedValue = useMemo(() => {
    if (typeof value !== 'string') {
      return value;
    }

    if (isMoneyInput) {
      return formatMoney(value, switchLanguage);
    }

    if (mask) {
      return applyMask(value, mask);
    }

    return value;
  }, [isMoneyInput, mask, switchLanguage, value]);

  const resolvedPlaceholder = isLoading && loadingText ? loadingText : placeholder;

  const wrapperClassName = useMemo(() => {
    return joinClass([
      'flex items-center gap-2 rounded-xl px-3 transition',
      SIZE_CLASS_MAP[size],
      VARIANT_CLASS_MAP[variant],
      isInvalid && 'border-red-400 focus-within:border-red-400 focus-within:ring-red-100',
      disabled && 'cursor-not-allowed bg-slate-100 text-slate-400 opacity-70',
      fullWidth && 'w-full',
      inputWrapperClassName,
    ]);
  }, [disabled, fullWidth, inputWrapperClassName, isInvalid, size, variant]);

  const handleChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const nextRawValue = event.target.value;
    const nextValue = isMoneyInput
      ? formatMoney(nextRawValue, switchLanguage)
      : applyMask(nextRawValue, mask);

    if (nextValue !== nextRawValue) {
      event.target.value = nextValue;
    }

    onChange?.(event);
    onValueChange?.(nextValue, event);
  }, [isMoneyInput, mask, onChange, onValueChange, switchLanguage]);

  const handleClear = useCallback(() => {
    // istanbul ignore next – clear button is hidden when disabled/readOnly (shouldShowClearButton), so this guard is defensive only
    if (disabled || readOnly) {
      return;
    }

    onClear?.();
  }, [disabled, onClear, readOnly]);

  const shouldShowClearButton = showClearButton && hasValue && !isLoading && !disabled && !readOnly;

  return (
    <div>
      <label className="flex flex-col gap-1.5">
        { label && (
          <Text
            size="xs"
            color="text-slate-600"
            weight="semibold"
            tracking="wide"
            className="uppercase">
            { label }
          </Text>
        )}
        <div className={joinClass([fullWidth && 'w-full', containerClassName])}>
          <div className={wrapperClassName}>
            {leadingIcon ? (
              <span aria-hidden='true' className='inline-flex shrink-0 text-slate-500'>
                {leadingIcon}
              </span>
            ) : null}

            <input
              {...inputProps}
              ref={ref}
              type={isMoneyInput ? 'text' : type}
              inputMode={isMoneyInput ? 'decimal' : inputProps.inputMode}
              value={formattedValue}
              disabled={disabled}
              readOnly={readOnly}
              placeholder={resolvedPlaceholder}
              aria-invalid={isInvalid || undefined}
              aria-busy={isLoading || undefined}
              className={joinClass([
                'w-full bg-transparent outline-none placeholder:text-slate-400',
                'disabled:cursor-not-allowed',
                className,
              ])}
              onChange={handleChange}
            />

            {isLoading ? (
              <span
                aria-hidden='true'
                className='inline-block h-4 w-4 shrink-0 animate-spin rounded-full border-2 border-slate-400 border-t-transparent'
              />
            ) : null}

            {shouldShowClearButton ? (
              <button
                type='button'
                aria-label={clearButtonAriaLabel}
                onClick={handleClear}
                className='inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-slate-700'
              >
                <MdClose size={16} aria-hidden='true' />
              </button>
            ) : null}

            {!isLoading && !shouldShowClearButton && trailingIcon ? (
              <span aria-hidden='true' className='inline-flex shrink-0 text-slate-500'>
                {trailingIcon}
              </span>
            ) : null}
          </div>

          {errorMessage ? (
            <p className={joinClass(['mt-1 text-xs font-medium text-red-600', helperClassName])} role='alert'>
              {errorMessage}
            </p>
          ) : null}

          {!errorMessage && helperText ? (
            <p className={joinClass(['mt-1 text-xs text-slate-500', helperClassName])}>
              {helperText}
            </p>
          ) : null}
        </div>
      </label>
    </div>

  );
});

Input.displayName = 'Input';

export default React.memo(Input);
