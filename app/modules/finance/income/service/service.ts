import { BaseServiceAbstract } from '@/app/shared';
import type {
  TIncome ,
  TIncomeCreate ,
  TIncomeUpdate,
} from '../types';

export class IncomeService extends BaseServiceAbstract<TIncome, TIncomeCreate, TIncomeUpdate> {
  constructor(baseUrl: string ,token?: string) {
    super(baseUrl ,'income' ,token);
  }
}