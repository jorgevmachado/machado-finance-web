import type { TEntity } from '@/app/modules';
import type { TPaginateBaseFilter } from '@/app/ui';

export type TIncome = TEntity & {
  source: string;
  amount: number;
  source_code: string;
  finance_id: string;
  account_id: string;
  received_at: string;
  description: string;
  reference_year: number;
  reference_month: number;
}

export type TIncomeFilter = TPaginateBaseFilter & {
  source?: string;
  account_id?: string;
  reference_year?: number;
  reference_month?: number;
}

export type TIncomeCreate = {
  source: string;
  amount: number;
  account_id: string;
  received_at: string;
  description: string;
  reference_year: number;
  reference_month: number;
}

export type TIncomeUpdate = {
  source?: string;
  amount?: number;
  account_id: string;
  received_at?: string;
  description?: string;
  reference_year?: number;
  reference_month?: number;
}