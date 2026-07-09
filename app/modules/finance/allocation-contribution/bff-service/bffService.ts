import { BffBaseServiceAbstract } from '@/app/shared';

import type {
  TAllocationContribution ,
  TAllocationContributionCreate ,
  TAllocationContributionFilter ,
  TAllocationContributionUpdate,
} from '../types';

export class AllocationContributionBffService extends BffBaseServiceAbstract<TAllocationContribution ,TAllocationContributionCreate ,TAllocationContributionUpdate ,TAllocationContributionFilter> {
  constructor(baseUrl: string) {
    super('allocation-contributions' ,'contribution' ,baseUrl);
  }
}