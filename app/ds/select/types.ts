import { type ChangeEvent, type ReactNode } from 'react';

export type SelectOption<T extends string = string> = {
  key?: string;
  value: T;
  label: ReactNode;
  disabled?: boolean;
};

export type SelectSize = 'sm' | 'md';

export type SelectProps<T extends string = string> = {
  size?: SelectSize;
  name: string;
  label?: ReactNode;
  value: T | '';
  options: Array<SelectOption<T>>;
  required?: boolean;
  disabled?: boolean;
  helperText?: ReactNode;
  placeholder?: string;
  caseSensitive?: boolean;
  onValueChange?: (value: T, event: ChangeEvent<HTMLInputElement>) => void;
  legendClassName?: string;
  helperClassName?: string;
  optionClassName?: string;
  containerClassName?: string;
  defaultNoOptionLabel?: string;
};

