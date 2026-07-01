import { type ChangeEvent, type ReactNode } from 'react';

export type SelectOption<T extends string = string> = {
  key?: string;
  value: T;
  label: ReactNode;
  disabled?: boolean;
};

export type SelectSize = 'sm' | 'md';

export type SelectProps<T extends string = string> = {
  label?: ReactNode;
  helperText?: ReactNode;
  name: string;
  value: T | '';
  options: Array<SelectOption<T>>;
  required?: boolean;
  disabled?: boolean;
  size?: SelectSize;
  caseSensitive?: boolean;
  onValueChange?: (value: T, event: ChangeEvent<HTMLInputElement>) => void;
  containerClassName?: string;
  legendClassName?: string;
  helperClassName?: string;
  optionsContainerClassName?: string;
  optionClassName?: string;
};

