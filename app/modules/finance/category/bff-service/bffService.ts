import { BffBaseServiceAbstract } from '@/app/shared';

import type { TCategory, TCategoryCreate, TCategoryUpdate, TCategoryFilter } from '../types';

export class CategoryBffService extends BffBaseServiceAbstract<TCategory, TCategoryCreate, TCategoryUpdate, TCategoryFilter> {
  constructor(baseUrl: string) {
    super('category', 'category', baseUrl);
  }
}