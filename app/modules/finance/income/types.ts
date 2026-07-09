import type { TEntity } from '@/app/modules';
import type { TPaginateBaseFilter } from '@/app/ui';
import type { TEntityMonth ,TMonthPersist } from '../month';

export type TIncomeMonth = TEntityMonth & {
  income_id: string;
  received_at?: string;
}

export type TIncome = TEntity & {
  months: Array<TIncomeMonth>;
  source: string;
  source_code: string;
  account_id: string;
  description: string;
}

export type TIncomeFilter = TPaginateBaseFilter & {
  source?: string;
  account_id?: string;
  reference_year?: number;
  reference_month?: number;
}

export type TIncomeCreate = {
  months: Array<TMonthPersist>;
  source: string;
  account_id: string;
  description: string;
  reference_day?: number;
  reference_year: number;
  reference_month?: number;
}

export type TIncomeUpdate = {
  months?: Array<TMonthPersist>;
  source?: string;
  account_id?: string;
  description?: string;
}

export type TDraftIncome = {
  source: string;
  description: string;
  account_id: string;
  reference_year: number;
}