import { BaseServiceAbstract } from '@/app/shared';

import type {
  TExpense ,
  TExpenseCreate ,
  TExpenseUpdate,
} from '../types';

export class ExpenseService  extends BaseServiceAbstract<TExpense ,TExpenseCreate ,TExpenseUpdate> {
  constructor(baseUrl: string ,token?: string) {
    super(baseUrl ,'expenses' ,token);
  }
}