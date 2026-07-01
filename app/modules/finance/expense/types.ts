import type { TPaginateBaseFilter } from '@/app/ui';

import type { TEntity } from '@/app/modules';

import type { TAllocation } from '../allocation';
import type { TCategory } from '../category';

import { EExpenseStatus } from './enum';

export type TExpense = TEntity & {
  status: EExpenseStatus;
  amount: number;
  paid_at?: string;
  category: TCategory;
  allocation: TAllocation;
  finance_id: string;
  account_id: string;
  description: string;
}

export type TExpenseFilter = TPaginateBaseFilter & {
  status?: EExpenseStatus;
  account_id?: string;
  category_id?: string;
  allocation_id?: string;
}

export type TExpenseCreate = {
  status: EExpenseStatus;
  amount: number;
  paid_at?: string;
  account_id: string;
  category_id: string;
  description: string;
  allocation_id: string;
}

export type TExpenseUpdate = {
  status: EExpenseStatus;
  amount?: number;
  paid_at?: string;
  account_id?: string;
  category_id?: string;
  description?: string;
  allocation_id?: string;
}