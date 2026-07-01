import { type ChangeEvent, type InputHTMLAttributes, type ReactNode } from 'react';

import { type TTone } from '@/app/utils';

export type SwitchSize = 'sm' | 'md' | 'lg';

export type SwitchVariant = 'solid' | 'outline';

export type SwitchLabelPosition = 'start' | 'end';

export type SwitchProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size' | 'onChange'> & {
  label?: ReactNode;
  description?: ReactNode;
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  onCheckedChange?: (checked: boolean, event: ChangeEvent<HTMLInputElement>) => void;
  size?: SwitchSize;
  tone?: TTone;
  variant?: SwitchVariant;
  labelPosition?: SwitchLabelPosition;
  loading?: boolean;
  loadingLabel?: string;
  fullWidth?: boolean;
  checkedLabel?: ReactNode;
  uncheckedLabel?: ReactNode;
  containerClassName?: string;
  switchClassName?: string;
  thumbClassName?: string;
  labelClassName?: string;
  descriptionClassName?: string;
};
