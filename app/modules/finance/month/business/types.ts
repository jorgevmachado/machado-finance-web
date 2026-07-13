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
  status?: EMonthStatus;
  paid_at?: string;
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
  paid_at?: string;
  reference_year: number;
  reference_month: number;
}

export type TConvertMonthPersistOptions = {
  dateField?: 'received_at' | 'paid_at';
  includeStatus?: boolean;
}

export type TDraftMonth = Record<TMonthKey, TMonthPersist>;

export type BuildMonthPersistByInstallmentsParams = {
  paid?: boolean;
  amount: number,
  withStatus?: boolean;
  referenceDay: number;
  referenceMonth: number;
  transactionDate: Date,
  currentInstallment?: number;
  totalOfInstallments: number;
}