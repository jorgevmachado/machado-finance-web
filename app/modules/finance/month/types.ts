import type { TEntity } from '@/app/modules';

export type TEntityMonth = TEntity &{
  amount: number;
  reference_year: number;
  reference_month: number;
}