import type { TEntity } from '@/app/modules';
import type { TPaginateBaseFilter } from '@/app/ui';
import { EAccountType } from './enum';

export type TAccount = TEntity & {
  name: string;
  type: EAccountType;
  is_active: boolean;
  finance_id: string;
  initial_balance: number;
  current_balance: number;
}

export type TAccountFilter = TPaginateBaseFilter & {
  type?: EAccountType;
  name?: string;
  is_active?: boolean;
}

export type TAccountCreate = {
  name: string;
  type: EAccountType;
  initial_balance: number;
}

export type TAccountUpdate = {
  name?: string;
  type?: EAccountType;
  initial_balance?: number;
}

export type TDraftAccount = {
  name: string;
  type: EAccountType | '';
  initial_balance: number | string;
}