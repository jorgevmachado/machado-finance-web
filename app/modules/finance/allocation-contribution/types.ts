import type { TEntity } from '@/app/modules';
import { TPaginateBaseFilter } from '@/app/ds';

export type TAllocationContribution =  TEntity & {
  amount: number;
  account_id: string;
  finance_id: string;
  allocation_id: string;
  description: string;
  reference_year: number;
  reference_month: number;
  contributor_name: string;
};

export type TAllocationContributionFilter = TPaginateBaseFilter & {}