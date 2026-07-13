import type { TEntity } from '@/app/modules';
import { EMonthStatus } from './enum';

export type TEntityMonth = TEntity &{
  amount: number;
  status?: EMonthStatus;
  reference_year: number;
  reference_month: number;
}

export type TMonthPersist = {
  amount: number;
  status?: EMonthStatus;
  reference_day?: number;
  reference_month: number;
  transaction_date?: string;
}