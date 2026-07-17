import type { TEntity } from '@/app/shared';

import type { TCategory } from '@/app/modules/category';

export type TFinance = TEntity & {
  user_id: string;
  categories: Array<TCategory>;
}