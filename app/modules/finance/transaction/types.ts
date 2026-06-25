import { TEntity } from '@/app/modules';
import { TPaginateBaseFilter } from '@/app/ds';

export type TTransactionType = 'INCOME' | 'EXPENSE' | 'TRANSFER';
export type TTransactionStatus = 'PAID' | 'PENDING' | 'CANCELLED';

export type TTransaction = TEntity & {
  type: TTransactionType;
  status: TTransactionStatus;
  amount: number;
  paid_at: string;
  finance_id: string;
  account_id: string;
  category_id: string;
  description: string;
  allocation_id: string;
  transaction_date: string;
}

export type TTransactionFilter = TPaginateBaseFilter & {}