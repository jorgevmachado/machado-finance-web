import { TEntity } from '@/app/modules';
import { TPaginateBaseFilter } from '@/app/ds';

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