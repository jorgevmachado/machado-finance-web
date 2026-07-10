import { BffBaseServiceAbstract } from '@/app/shared';

import type { TExpense, TExpenseCreate, TExpenseUpdate, TExpenseFilter } from '../types';

export class ExpenseBffService extends BffBaseServiceAbstract<TExpense, TExpenseCreate, TExpenseUpdate, TExpenseFilter> {
  constructor(baseUrl: string) {
    super('expense', 'expense', baseUrl);
  }
}