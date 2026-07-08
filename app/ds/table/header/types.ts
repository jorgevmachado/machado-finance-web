import React from 'react';

import type { ConditionColor, TTableAlign } from '../types';

import { ETypeTableHeader } from './enum';

export type TableHeaderItem = {
  label: string;
  type?: ETypeTableHeader;
  value: string;
  align?: TTableAlign;
  style?: React.CSSProperties;
  footer?: string | number;
  sortable?: boolean;
  uppercase?: boolean;
  conditionColor?: ConditionColor;
};