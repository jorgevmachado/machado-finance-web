import type { TEntity } from '@/app/modules';
import type { TPaginateBaseFilter } from '@/app/ui';

export type TCategoryType = 'FOOD' | 'OTHER' | 'STUDIES' | 'UTILITY' | 'HEALTH' | 'PERSONAL' | 'TRANSPORT' | 'ENTERTAINMENT' | 'GOVERNMENT_FEES';

export type TCategory = TEntity & {
  name: string;
  type: TCategoryType;
  name_code: string;
  finance_id: string;
  description: string;
}

export type TCategoryFilter = TPaginateBaseFilter & {
  name?: string;
  type?: TCategoryType;
}

export type TCategoryCreate = {
  name: string;
  type: TCategoryType;
  description: string;
}

export type TCategoryUpdate = {
  name?: string;
  type?: TCategoryType;
  description?: string;
}