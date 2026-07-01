import type { TPaginateBaseFilter } from '@/app/ui';

import type { TEntity } from '@/app/modules';


export type TTransfer = TEntity & {
  amount: number;
  finance_id: string;
  description: string;
  transfer_date: string;
  to_account_id: string;
  from_account_id: string;
}

export type TTransferFilter = TPaginateBaseFilter & {
  transfer_date?: string;
  to_account_id?: string;
  from_account_id?: string;

}

export type TTransferCreate = {
  amount: number;
  description: string;
  transfer_date: string;
  to_account_id: string;
  from_account_id: string;
}

export type TTransferUpdate = {
  amount?: number;
  description?: string;
  transfer_date?: string;
  to_account_id?: string;
  from_account_id?: string;
}