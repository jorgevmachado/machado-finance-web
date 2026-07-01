import { BaseServiceAbstract  } from '@/app/shared';
import {
  TAllocationContribution ,
  TAllocationContributionCreate ,
  TAllocationContributionUpdate ,
} from '../types';

export class AllocationContributionService extends BaseServiceAbstract<TAllocationContribution, TAllocationContributionCreate, TAllocationContributionUpdate> {
  constructor(baseUrl: string ,token?: string) {
    super(baseUrl ,'allocation-contributions' ,token);
  }
}