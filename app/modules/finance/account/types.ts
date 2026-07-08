import type { TEntity } from '@/app/modules';
import type { TPaginateBaseFilter } from '@/app/ui';

import type{ TExpense } from '../expense';
import type{ TIncome } from '../income';
import type{ TTransfer } from '../transfer';
import type { TAllocationContribution } from '../allocation-contribution';

import { EAccountType } from './enum';
import { TAllocation } from '@/app/modules/finance';

export type TAccount = TEntity & {
  name: string;
  type: EAccountType;
  incomes: Array<TIncome>;
  allocations: Array<TAllocation>;
  expenses: Array<TExpense>;
  is_active: boolean;
  finance_id: string;
  initial_balance: number;
  current_balance: number;
  incoming_transfers: Array<TTransfer>;
  outgoing_transfers: Array<TTransfer>;
  allocation_contributions: Array<TAllocationContribution>;
}

export type TAccountFilter = TPaginateBaseFilter & {
  type?: EAccountType;
  name?: string;
  is_active?: boolean;
  reference_year?: number;
}

export type TAccountCreate = {
  name: string;
  type: EAccountType;
  initial_balance: number;
}

export type TAccountUpdate = {
  name?: string;
  type?: EAccountType;
  initial_balance?: number;
}

export type TDraftAccount = {
  name: string;
  type: EAccountType | '';
  initial_balance: number | string;
}