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
  children?: Array<TExpense>;
  parent_id?: string;
  payee_code: string;
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
  parent_id?: string;
  category_id?: string;
  description?: string;
  allocation_id?: string;
}

export type TDraftExpense = {
  payee: string;
  parent_id?: string;
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

export type TExpenseUploadExpenseItemResponse = {
  date: Date;
  payee: string;
  amount: number;
  category: TCategory;
  reference_month: number;
  current_installment: number;
  all_installments_paid: boolean;
  total_of_installments: number;
}

export type TExpenseUploadResponse = {
  bank: EBank;
  error: boolean;
  message: string;
  category: TCategory;
  expenses: Array<TExpenseUploadExpenseItemResponse>;
  bill_total: number;
  allocation: TAllocation;
  bill_due_date?: Date;
  date_of_issue?: Date;
  reference_year: number;
  reference_month: number;
  previous_bill_total: number;
  previous_bill_due_date?: Date;
}

export type TDraftExpenseUploaded = TExpenseUploadExpenseItemResponse & {
  order: number;
}

export type TPersistExpenseUploadInputs = {
  order: number;
  payee: string;
  amount: string;
  category?: TCategory;
}

export type TExpenseListPersist = {
  parent: TExpenseCreate;
  expenses: Array<TExpenseCreate>;
  reference_month: number;
}