import type { TEntity } from '@/app/modules';
import type { TPaginateBaseFilter } from '@/app/ui';

import type { TExpense } from '../expense';

export type TAllocation = TEntity & {
  name: string;
  expenses: Array<TExpense>;
  name_code: string;
  is_active: boolean;
  account_id: string;
  description: string;
}

export type TAllocationFilter = TPaginateBaseFilter & {
  name?: string;
  account_id?: string;
  is_active?: boolean;
  reference_year?: number;
}

export type TAllocationCreate = {
  name: string;
  account_id: string;
  description: string;
}

export type TAllocationUpdate = {
  name?: string;
  is_active?: boolean;
  account_id?: string;
  description?: string;
}

export type TDraftAllocation = {
  name: string;
  account_id: string;
  description: string;
}