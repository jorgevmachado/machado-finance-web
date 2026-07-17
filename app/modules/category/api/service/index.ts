import { getBaseUrl } from '@/app/shared';

export type { IApiService } from '../../../../shared/api/service/types';

import { CategoryService } from './service';

export const categoryService = (token?: string): CategoryService => {
  return new CategoryService(getBaseUrl(), token);
};