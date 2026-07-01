'use client';

import React from 'react';

import { Text } from '@/app/ds';
import { joinClass } from '@/app/utils';

import { type SelectProps, type SelectSize } from './types';

const SIZE_CLASS_MAP: Record<SelectSize, string> = {
  sm: 'px-3 py-2 text-sm',
  md: 'px-4 py-2.5 text-sm',
};

const Select = <T extends string>({
  label,
  helperText,
  name,
  value,
  options,
  required = false,
  disabled = false,
  size = 'sm',
  caseSensitive = true,
  onValueChange,
  containerClassName,
  legendClassName,
  helperClassName,
  optionsContainerClassName,
  optionClassName,
}: SelectProps<T>): React.JSX.Element => {
  const normalize = (nextValue: string) => (caseSensitive ? nextValue : nextValue.toUpperCase());

  return (
    <fieldset className={joinClass(['flex flex-col gap-2', containerClassName])} disabled={disabled}>
      {label ? (
        <Text
          as="legend"
          size="xs"
          color="text-slate-600"
          weight="semibold"
          tracking="wide"
          className={joinClass(['uppercase', !helperText && 'mb-2', legendClassName])}
        >
          {label}
        </Text>
      ) : null}

      {helperText ? (
        <Text as="p" size="xs" color="text-slate-500" className={helperClassName}>
          {helperText}
        </Text>
      ) : null}

      <div className={joinClass(['grid grid-cols-1 gap-2 sm:grid-cols-2', optionsContainerClassName])}>
        {options.map((option) => {
          const isSelected = normalize(value) === normalize(option.value);
          const isOptionDisabled = disabled || option.disabled;
          return (
            <label
              key={option.key ?? option.value}
              className={joinClass([
                'flex items-center gap-2 rounded-xl border transition-colors',
                SIZE_CLASS_MAP[size],
                !isOptionDisabled && 'cursor-pointer',
                isSelected
                  ? 'border-blue-300 bg-blue-50 text-blue-700'
                  : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50',
                isOptionDisabled && 'cursor-not-allowed opacity-70 hover:bg-white',
                optionClassName,
              ])}
            >
              <input
                type="radio"
                name={name}
                value={option.value}
                checked={isSelected}
                required={required}
                disabled={isOptionDisabled}
                onChange={(event) => onValueChange?.(option.value, event)}
                className="h-4 w-4 accent-blue-600"
              />
              <span>{option.label}</span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
};

Select.displayName = 'Select';

export default React.memo(Select) as typeof Select;
