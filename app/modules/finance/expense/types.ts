import type { TPaginateBaseFilter } from '@/app/ui';

import type { TEntity } from '@/app/modules';

import type { TAllocation } from '../allocation';
import type { TCategory } from '../category';
import type { TEntityMonth ,TMonthPersist } from '../month';
import { EBank } from '../bank';



export type TExpenseMonth = TEntityMonth  & {
  paid_at?: string;
  expense_id: string;
}


export type TExpense = TEntity & {
  payee: string;
  months: Array<TExpenseMonth>;
  category: TCategory;
  parent_id?: string;
  allocation: TAllocation;
  description: string;
}

export type TExpenseFilter = TPaginateBaseFilter & {
  payee?: string;
  category_id?: string;
  allocation_id?: string;
  reference_year?: number;
  reference_month?: number;
}

export type TExpenseCreate = {
  payee: string;
  months: Array<TMonthPersist>;
  parent_id?: string;
  category_id: string;
  description: string;
  allocation_id: string;
  reference_day?: number;
  reference_year: number;
  reference_month?: number;
}

export type TExpenseUpdate = {
  payee?: string;
  months?: Array<TMonthPersist>;
  category_id?: string;
  description?: string;
  allocation_id?: string;
}

export type TDraftExpense = {
  payee: string;
  description: string;
  category_id: string;
  allocation_id: string;
  reference_year: number;
}

export type TDraftExpenseUpload = {
  file: File | null;
  bank: EBank | '';
}

export type TExpenseUpload = {
  file: File;
  bank: EBank;
  allocation_id: string;
  reference_year?: number;
}