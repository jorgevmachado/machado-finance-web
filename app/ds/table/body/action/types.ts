import type { TTableAlign } from '../../types';

export type TableActions = {
  text?: string;
  edit?: TableActionsItem;
  show?: TableActionsItem;
  align?: TTableAlign;
  delete?: TableActionsItem;
  uppercase?: boolean;
}

export type TableActionsItem = {
  label: string;
  onClick: (item: unknown) => void;
}