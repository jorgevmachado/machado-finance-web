import { ApiBaseServiceAbstract } from '@/app/shared';

import type {
  TCategory ,
  TCategoryCreate ,
  TCategoryUpdate,
} from '../../types';

export class CategoryService extends ApiBaseServiceAbstract<TCategory, TCategoryCreate, TCategoryUpdate> {
  constructor(baseUrl: string ,token?: string) {
    super(baseUrl ,'finance/categories' ,token);
  }
}