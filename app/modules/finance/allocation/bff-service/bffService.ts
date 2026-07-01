import { BffBaseServiceAbstract } from '@/app/shared';

import type {
  TAllocation ,
  TAllocationCreate ,
  TAllocationFilter ,
  TAllocationUpdate ,
} from '../types';

export class AllocationBffService extends BffBaseServiceAbstract<TAllocation, TAllocationCreate, TAllocationUpdate, TAllocationFilter> {
  constructor(baseUrl: string) {
    super('allocation', 'allocations', baseUrl);
  }
}