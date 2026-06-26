import type { TEntity } from '@/app/modules';
import type { TPaginateBaseFilter } from '@/app/ui';

import { EAllocationType } from './enum';

export type TAllocation = TEntity & {
  name: string;
  type: EAllocationType;
  name_code: string;
  is_active: boolean;
  finance_id: string;
  description: string;
}

export type TAllocationFilter = TPaginateBaseFilter & {
  name?: string;
  type?: EAllocationType;
  is_active?: boolean;
}

export type TAllocationCreate = {
  name: string;
  type: EAllocationType;
  description: string;
}

export type TAllocationUpdate = {
  name?: string;
  type?: EAllocationType;
  is_active?: boolean;
  description?: string;
}