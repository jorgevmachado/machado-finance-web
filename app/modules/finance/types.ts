import type { TEntity } from '@/app/modules';
import type {
  TAccount ,
  TAllocation ,
  TCategory ,
  TIncome,
  TTransaction,
  TAllocationContribution
} from '@/app/modules/finance';

export type TFinance = TEntity & {
  user_id: string;
  incomes: Array<TIncome>;
  accounts: Array<TAccount>;
  categories: Array<TCategory>;
  allocations: Array<TAllocation>;
  transactions: Array<TTransaction>;
  allocation_contributions: Array<TAllocationContribution>;
}