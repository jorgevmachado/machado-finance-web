import { BaseServiceAbstract } from '@/app/shared';
import type {
  TAllocation ,
  TAllocationCreate ,
  TAllocationUpdate,
} from '../types';

export class AllocationService extends BaseServiceAbstract<TAllocation, TAllocationCreate, TAllocationUpdate> {
  constructor(baseUrl: string ,token?: string) {
    super(baseUrl ,'Allocation' ,token);
  }
}