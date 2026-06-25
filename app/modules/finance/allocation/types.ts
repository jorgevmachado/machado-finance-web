import { type TEntity } from '@/app/modules';
import { TPaginateBaseFilter } from '@/app/ds';

export type TAllocationType = 'OTHER' | 'HOUSE' | 'FAMILY' | 'PERSONAL';

export type TAllocation = TEntity & {
  name: string;
  type: TAllocationType;
  name_code: string;
  is_active: boolean;
  finance_id: string;
  description: string;
}

export type TAllocationFilter = TPaginateBaseFilter & {}