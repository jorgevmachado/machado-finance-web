import type { TEntity } from '@/app/modules';

import type { TPaginateBaseFilter } from '@/app/ui';

import type { TAllocation } from '../allocation';
import type { TEntityMonth ,TMonthPersist } from '../month';

export type TAllocationContributionMonth = TEntityMonth & {
  allocation_contribution_id: string;
}

export type TAllocationContribution =  TEntity & {
  months: Array<TAllocationContributionMonth>;
  allocation: TAllocation;
  description: string;
  contributor_name: string;
};

export type TAllocationContributionFilter = TPaginateBaseFilter & {
  allocation_id?: string;
  reference_year?: number;
  reference_month?: number;
  contributor_name?: string;
}

export type TAllocationContributionCreate = {
  months: Array<TMonthPersist>;
  description: string;
  allocation_id: string;
  reference_year: number;
  contributor_name: string;
}

export type TAllocationContributionUpdate = {
  months?: Array<TMonthPersist>;
  description?: string;
  allocation_id?: string;
  reference_year?: number;
  contributor_name?: string;
}

export type TDraftAllocationContribution = {
  description: string;
  allocation_id: string;
  reference_year: number;
  contributor_name: string;
}