import { TEntity } from '@/app/modules';
import { TPaginateBaseFilter } from '@/app/ds';

export type TAccountType = 'PIX' | 'BANK' | 'CASH' | 'OTHER' | 'INVESTMENT' | 'CREDIT_CARD' | 'ACCOUNT_DEBIT';

export type TAccount = TEntity & {
  name: string;
  type: TAccountType;
  is_active: boolean;
  finance_id: string;
  initial_balance: number;
  current_balance: number;
}

export type TAccountFilter = TPaginateBaseFilter & {}