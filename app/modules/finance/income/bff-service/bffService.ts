import { BffBaseServiceAbstract } from '@/app/shared';

import type { TIncome, TIncomeCreate, TIncomeUpdate, TIncomeFilter } from '../types';

export class IncomeBffService extends BffBaseServiceAbstract<TIncome, TIncomeCreate, TIncomeUpdate, TIncomeFilter> {
  constructor(baseUrl: string) {
    super('income', 'incomes', baseUrl);
  }
}