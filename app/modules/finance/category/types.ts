import type { TEntity } from '@/app/modules';
import type { TPaginateBaseFilter } from '@/app/ui';


export type TCategory = TEntity & {
  name: string;
  name_code: string;
  finance_id: string;
  description: string;
}

export type TCategoryFilter = TPaginateBaseFilter & {
  name?: string;
}

export type TCategoryCreate = {
  name: string;
  description: string;
}

export type TCategoryUpdate = {
  name?: string;
  description?: string;
}

export type TDraftCategory = {
  name: string;
  description: string;
}