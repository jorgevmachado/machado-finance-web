import type { TEntity } from '@/app/modules';

import type { TAccount } from './account';
import type { TAllocation } from './allocation';
import type { TPaginateBaseFilter } from '@/app/ui';

export type TFinance = TEntity & {
  user_id: string;
  accounts: Array<TAccount>;
  allocations: Array<TAllocation>;
}

export type TFinanceFilter = Omit<TPaginateBaseFilter, 'page' | 'limit'> & {
  year?: number;
}

export type TFinanceMonth = TEntity &{
  amount: number;
  reference_year: number;
  reference_month: number;
}