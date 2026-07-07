import type { TPaginateBaseFilter } from '@/app/ui';

import type { TEntity } from '@/app/modules';

import type { TAllocation } from '../allocation';
import type { TCategory } from '../category';
import type { TEntityMonth } from '../month';



export type TExpenseMonth = TEntityMonth  & {
  paid_at?: string;
  expense_id: string;
}


export type TExpense = TEntity & {
  months: Array<TExpenseMonth>;
  category: TCategory;
  parent_id?: string;
  allocation: TAllocation;
  finance_id: string;
  account_id: string;
  description: string;
}

export type TExpenseFilter = TPaginateBaseFilter & {
  account_id?: string;
  category_id?: string;
  allocation_id?: string;
}

export type TExpenseCreate = {
  account_id: string;
  category_id: string;
  description: string;
  allocation_id: string;
}

export type TExpenseUpdate = {
  paid_at?: string;
  account_id?: string;
  category_id?: string;
  description?: string;
  allocation_id?: string;
}