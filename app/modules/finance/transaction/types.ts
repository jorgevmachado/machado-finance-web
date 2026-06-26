import type { TEntity } from '@/app/modules';
import type { TPaginateBaseFilter } from '@/app/ui';

import { ETransactionStatus ,ETransactionType } from './enum';

export type TTransaction = TEntity & {
  type: ETransactionType;
  status: ETransactionStatus;
  amount: number;
  paid_at: string;
  finance_id: string;
  account_id: string;
  category_id: string;
  description: string;
  allocation_id: string;
  transaction_date: string;
}

export type TTransactionFilter = TPaginateBaseFilter & {
  type?: ETransactionType;
  status?: ETransactionStatus;
  account_id?: string;
  category_id?: string;
  allocation_id?: string;
}

export type TTransactionCreate = {
  type: ETransactionType;
  status: ETransactionStatus;
  amount: number;
  paid_at?: string;
  account_id: string;
  category_id: string;
  description: string;
  allocation_id: string;
  transaction_date: string;
}

export type TTransactionUpdate = {
  type?: ETransactionType;
  status?: ETransactionStatus;
  amount?: number;
  paid_at?: string;
  description?: string;
  transaction_date?: string;
}