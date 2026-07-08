import { TEntity } from '@/app/modules';
import { EMonthStatus } from '../enum';

export type TMonthKey =
  | 'january'
  | 'february'
  | 'march'
  | 'april'
  | 'may'
  | 'june'
  | 'july'
  | 'august'
  | 'september'
  | 'october'
  | 'november'
  | 'december';

export type TMonthSummary = TEntity & {
  month: string;
  amount: number;
  paid_at?: Date;
  income_id?: string;
  expense_id?: string;
  received_at?: string;
  reference_year: number;
  reference_month: number;
  allocation_contribution_id?: string;
}

export type TMonthMap = Record<TMonthKey, TMonthSummary>;

export type TMonthPersist = {
  amount: number;
  status?: EMonthStatus;
  received_at?: string;
  reference_year: number;
  reference_month: number;
}

export type TDraftMonth = Record<TMonthKey, TMonthPersist>;