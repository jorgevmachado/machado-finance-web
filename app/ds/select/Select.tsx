'use client';

import React, { useCallback, useState } from 'react';

import { MdArrowDropDown } from 'react-icons/md';

import { Text } from '@/app/ds';
import { joinClass } from '@/app/utils';

import { type SelectProps, type SelectSize } from './types';

const SIZE_CLASS_MAP: Record<SelectSize, string> = {
  sm: 'h-9 text-sm',
  md: 'h-10 text-sm',
};

const VARIANT_CLASS_MAP = {
  outline: 'border border-slate-200 bg-white text-slate-700 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100',
};

const Select = <T extends string>({
  label,
  name,
  size = 'sm',
  helperText,
  value,
  options,
  required = false,
  disabled = false,
  placeholder = 'Select an option',
  onValueChange,
  legendClassName,
  helperClassName,
  optionClassName,
  containerClassName,
  defaultNoOptionLabel = 'No options available',
}: SelectProps<T>): React.JSX.Element => {
  const [isOpen, setIsOpen] = useState(false);

  const selectedOption = options.find((opt) => opt.value === value);
  const displayLabel = selectedOption?.label || placeholder;

  const handleSelectOption = useCallback((optionValue: T) => {
    onValueChange?.(optionValue, {} as never);
    setIsOpen(false);
  }, [onValueChange]);

  const handleBlur = useCallback(() => {
    globalThis.setTimeout(() => {
      setIsOpen(false);
    }, 120);
  }, []);

  const wrapperClassName = joinClass([
    'flex items-center gap-2 rounded-xl px-3 transition relative cursor-pointer',
    SIZE_CLASS_MAP[size],
    VARIANT_CLASS_MAP.outline,
    disabled && 'cursor-not-allowed bg-slate-100 text-slate-400 opacity-70',
  ]);

  return (
    <label className="flex flex-col gap-1.5">
      {label ? (
        <Text
          size="xs"
          color="text-slate-600"
          weight="semibold"
          tracking="wide"
          className={joinClass(['uppercase', legendClassName])}
        >
          {label}
        </Text>
      ) : null}

      {helperText ? (
        <Text as="p" size="xs" color="text-slate-500" className={helperClassName}>
          {helperText}
        </Text>
      ) : null}

      <div className={joinClass(['relative w-full', containerClassName])}>
        <button
          type="button"
          disabled={disabled}
          onClick={() => !disabled && setIsOpen(!isOpen)}
          onBlur={handleBlur}
          className={joinClass(['w-full', wrapperClassName])}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
        >
          <span className="flex-1 text-left truncate text-slate-700">
            {displayLabel}
          </span>
          <MdArrowDropDown
            className={joinClass([
              'pointer-events-none shrink-0 text-slate-600 transition-transform',
              isOpen && 'rotate-180',
            ])}
            size={20}
          />
        </button>

        {isOpen && !disabled ? (
          <ul
            role="listbox"
            className={joinClass([
              'absolute left-0 right-0 top-[calc(100%+4px)] z-20 max-h-52 overflow-y-auto rounded-xl border border-slate-200 bg-white p-1 shadow-lg',
              optionClassName,
            ])}
          >
            {options.length > 0 ? (
              options.map((option) => {
                const isSelected = option.value === value;
                return (
                  <li
                    key={option.key ?? option.value}
                    role="option"
                    aria-selected={isSelected}
                    onMouseDown={() => !option.disabled && handleSelectOption(option.value)}
                    className={joinClass([
                      'cursor-pointer rounded-lg px-3 py-2 text-sm transition',
                      isSelected
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-slate-700 hover:bg-slate-50',
                      option.disabled && 'cursor-not-allowed opacity-50',
                    ])}
                  >
                    {option.label}
                  </li>
                );
              })
            ) : (
              <li className="px-3 py-2 text-sm text-slate-400">
                {defaultNoOptionLabel}
              </li>
            )}
          </ul>
        ) : null}
        <select
          className="sr-only"
          aria-hidden="true"
          tabIndex={-1}
          name={name}
          value={value}
          required={required}
          disabled={disabled}
          onChange={() => undefined}
        >
          <option value="" />
          {options.map((option) => (
            <option key={option.key ?? option.value} value={option.value} disabled={option.disabled}>
              {option.value}
            </option>
          ))}
        </select>
      </div>
    </label>
  );
};

Select.displayName = 'Select';

export default React.memo(Select) as typeof Select;
