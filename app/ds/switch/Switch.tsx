'use client';

import React, { useMemo, useState } from 'react';

import { joinClass, type TTone } from '@/app/utils';

import { Text } from '@/app/ds';

import {
  type SwitchProps,
  type SwitchSize,
} from './types';

const SIZE_CLASS_MAP: Record<SwitchSize, { track: string; thumb: string; translate: string }> = {
  sm: {
    track: 'h-5 w-9 p-0.5',
    thumb: 'h-4 w-4',
    translate: 'translate-x-4',
  },
  md: {
    track: 'h-6 w-11 p-0.5',
    thumb: 'h-5 w-5',
    translate: 'translate-x-5',
  },
  lg: {
    track: 'h-8 w-14 p-1',
    thumb: 'h-6 w-6',
    translate: 'translate-x-6',
  },
};

const TONE_CLASS_MAP: Record<TTone, { on: string; off: string; ring: string; border: string }> = {
  default: {
    on: 'bg-slate-900',
    off: 'bg-slate-300',
    ring: 'focus-within:ring-slate-500',
    border: 'border-slate-500',
  },
  muted: {
    on: 'bg-slate-600',
    off: 'bg-slate-300',
    ring: 'focus-within:ring-slate-500',
    border: 'border-slate-500',
  },
  white: {
    on: 'bg-white',
    off: 'bg-slate-200',
    ring: 'focus-within:ring-slate-300',
    border: 'border-slate-300',
  },
  subtle: {
    on: 'bg-slate-500',
    off: 'bg-slate-200',
    ring: 'focus-within:ring-slate-400',
    border: 'border-slate-400',
  },
  primary: {
    on: 'bg-blue-600',
    off: 'bg-slate-300',
    ring: 'focus-within:ring-blue-500',
    border: 'border-blue-500',
  },
  secondary: {
    on: 'bg-slate-700',
    off: 'bg-slate-300',
    ring: 'focus-within:ring-slate-500',
    border: 'border-slate-500',
  },
  success: {
    on: 'bg-emerald-600',
    off: 'bg-slate-300',
    ring: 'focus-within:ring-emerald-500',
    border: 'border-emerald-500',
  },
  warning: {
    on: 'bg-amber-500',
    off: 'bg-slate-300',
    ring: 'focus-within:ring-amber-500',
    border: 'border-amber-500',
  },
  danger: {
    on: 'bg-red-600',
    off: 'bg-slate-300',
    ring: 'focus-within:ring-red-500',
    border: 'border-red-500',
  },
  info: {
    on: 'bg-sky-600',
    off: 'bg-slate-300',
    ring: 'focus-within:ring-sky-500',
    border: 'border-sky-500',
  },
  neutral: {
    on: 'bg-slate-500',
    off: 'bg-slate-300',
    ring: 'focus-within:ring-slate-400',
    border: 'border-slate-400',
  },
  inherit: {
    on: 'bg-inherit',
    off: 'bg-slate-300',
    ring: 'focus-within:ring-slate-400',
    border: 'border-inherit',
  },
};

const buildStatusText = (
  checked: boolean,
  checkedLabel?: React.ReactNode,
  uncheckedLabel?: React.ReactNode,
) => {
  if (checked) {
    return checkedLabel ?? null;
  }

  return uncheckedLabel ?? null;
};

const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(({
  id,
  name,
  label,
  description,
  checked,
  defaultChecked = false,
  onChange,
  onCheckedChange,
  disabled = false,
  readOnly = false,
  required = false,
  autoFocus = false,
  value,
  size = 'md',
  tone = 'primary',
  variant = 'solid',
  labelPosition = 'end',
  loading = false,
  loadingLabel = 'Loading...',
  fullWidth = false,
  checkedLabel,
  uncheckedLabel,
  containerClassName,
  switchClassName,
  thumbClassName,
  labelClassName,
  descriptionClassName,
  ...inputProps
}, ref) => {
  const [internalChecked, setInternalChecked] = useState<boolean>(defaultChecked);
  const isControlled = checked !== undefined;
  const resolvedChecked = isControlled ? checked : internalChecked;
  const isDisabled = disabled || loading || readOnly;
  const sizeClasses = SIZE_CLASS_MAP[size];
  const toneClasses = TONE_CLASS_MAP[tone];
  const statusText = useMemo(() => {
    if (loading) {
      return loadingLabel;
    }
    return buildStatusText(resolvedChecked, checkedLabel, uncheckedLabel);
  }, [checkedLabel, loading, loadingLabel, resolvedChecked, uncheckedLabel]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const nextChecked = event.target.checked;

    if (!isControlled) {
      setInternalChecked(nextChecked);
    }

    onChange?.(event);
    onCheckedChange?.(nextChecked, event);
  };

  const textContent = (
    <span className={joinClass(['flex min-w-0 flex-col', labelClassName])}>
      {label ? (
        <Text size='sm' weight='semibold' color='text-slate-800'>
          {label}
        </Text>
      ) : null}
      {description ? (
        <Text size='xs' color='text-slate-500' className={descriptionClassName}>
          {description}
        </Text>
      ) : null}
    </span>
  );

  return (
    <div
      className={joinClass([
        'flex items-center gap-3',
        fullWidth && 'w-full',
        labelPosition === 'start' ? 'justify-between' : 'justify-start',
        containerClassName,
      ])}
    >
      {labelPosition === 'start' ? textContent : null}

      <label
        className={joinClass([
          'inline-flex items-center gap-2',
          isDisabled ? 'cursor-not-allowed opacity-70' : 'cursor-pointer',
        ])}
      >
        <input
          {...inputProps}
          ref={ref}
          id={id}
          type='checkbox'
          role='switch'
          name={name}
          value={value}
          required={required}
          autoFocus={autoFocus}
          checked={resolvedChecked}
          disabled={isDisabled}
          aria-readonly={readOnly || undefined}
          aria-busy={loading || undefined}
          onChange={handleChange}
          className='sr-only'
        />

        <span
          aria-hidden='true'
          className={joinClass([
            'inline-flex shrink-0 items-center rounded-full transition-colors duration-200 focus-within:ring-2 focus-within:ring-offset-2',
            sizeClasses.track,
            toneClasses.ring,
            variant === 'outline' ? joinClass(['border bg-transparent', toneClasses.border]) : 'border border-transparent',
            resolvedChecked ? toneClasses.on : toneClasses.off,
            switchClassName,
          ])}
        >
          <span
            className={joinClass([
              'inline-block rounded-full bg-white shadow transition-transform duration-200',
              sizeClasses.thumb,
              resolvedChecked ? sizeClasses.translate : 'translate-x-0',
              thumbClassName,
            ])}
          />
        </span>

        {statusText ? (
          <Text size='xs' color='text-slate-600'>
            {statusText}
          </Text>
        ) : null}
      </label>

      {labelPosition === 'end' ? textContent : null}
    </div>
  );
});

Switch.displayName = 'Switch';

export default React.memo(Switch);
