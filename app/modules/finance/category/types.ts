import type { TEntity } from '@/app/modules';
import type { TPaginateBaseFilter } from '@/app/ui';

import { ECategoryType } from './enum';

export type TCategory = TEntity & {
  name: string;
  type: ECategoryType;
  name_code: string;
  finance_id: string;
  description: string;
}

export type TCategoryFilter = TPaginateBaseFilter & {
  name?: string;
  type?: ECategoryType;
}

export type TCategoryCreate = {
  name: string;
  type: ECategoryType;
  description: string;
}

export type TCategoryUpdate = {
  name?: string;
  type?: ECategoryType;
  description?: string;
}

export type TDraftCategory = {
  name: string;
  type: ECategoryType | '';
  description: string;
}