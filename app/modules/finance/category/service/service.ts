import { BaseServiceAbstract } from '@/app/shared';

import type {
  TCategory ,
  TCategoryCreate ,
  TCategoryUpdate,
} from '../types';

export class CategoryService extends BaseServiceAbstract<TCategory, TCategoryCreate, TCategoryUpdate> {
  constructor(baseUrl: string ,token?: string) {
    super(baseUrl ,'categories' ,token);
  }
}