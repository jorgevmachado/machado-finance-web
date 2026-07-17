import { BffBaseServiceAbstract } from '@/app/shared';
import type {
  TCategory ,
  TCategoryDraft,
  TCategoryCreate ,
  TCategoryFilter ,
  TCategoryUpdate,
} from '../../types';
import { categoryValidator } from '../../validator';

export class CategoryBff extends BffBaseServiceAbstract<TCategory, TCategoryCreate, TCategoryUpdate, TCategoryDraft, TCategoryFilter> {
  constructor() {
    super(
      'category',
      'category',
      categoryValidator,
    );
  }}