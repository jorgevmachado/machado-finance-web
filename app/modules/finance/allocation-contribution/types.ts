import type { TEntity } from '@/app/modules';

import type { TPaginateBaseFilter } from '@/app/ui';

import type { TAllocation } from '../allocation';
import type { TEntityMonth } from '../month';

export type TAllocationContributionMonth = TEntityMonth & {
  allocation_contribution_id: string;
}

export type TAllocationContribution =  TEntity & {
  months: Array<TAllocationContributionMonth>;
  allocation: TAllocation;
  account_id: string;
  finance_id: string;
  description: string;
  reference_year: number;
  reference_month: number;
  contributor_name: string;
};

export type TAllocationContributionFilter = TPaginateBaseFilter & {
  source?: string;
  account_id?: string;
  allocation_id: string;
  reference_year?: number;
  reference_month?: number;
  contributor_name?: number;
}

export type TAllocationContributionCreate = {
  amount: number;
  account_id: string;
  description: string;
  allocation_id: string;
  reference_year: number;
  reference_month: number;
  contributor_name: string;
}

export type TAllocationContributionUpdate = {
  amount?: number;
  description?: string;
  reference_year?: number;
  reference_month?: number;
  contributor_name?: string;
}