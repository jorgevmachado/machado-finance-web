import { getBaseUrl } from '@/app/shared';

import { FinanceService } from './service';

export const financeService = (token?: string): FinanceService => {
  return new FinanceService(getBaseUrl(), token);
};