import { TEntity } from '@/app/modules';
import { TPaginateBaseFilter } from '@/app/ds';

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

export type TIncomeFilter = TPaginateBaseFilter & {}