import type { TEntity } from '@/app/modules';
import { EMonthStatus } from './enum';

export type TEntityMonth = TEntity &{
  amount: number;
  status?: EMonthStatus;
  reference_year: number;
  reference_month: number;
}