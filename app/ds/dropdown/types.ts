import type React from 'react';

export type DropdownIconPosition = 'left' | 'right';

export type DropdownItem = {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  icon?: React.ReactNode;
  iconPosition?: DropdownIconPosition;
};

export type DropdownProps = {
  items: DropdownItem[];
  align?: 'left' | 'right';
};
