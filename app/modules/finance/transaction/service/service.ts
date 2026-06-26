import { BaseServiceAbstract } from '@/app/shared';

import type {
  TTransaction ,
  TTransactionCreate ,
  TTransactionUpdate,
} from '../types';

export class TransactionService  extends BaseServiceAbstract<TTransaction ,TTransactionCreate ,TTransactionUpdate> {
  constructor(baseUrl: string ,token?: string) {
    super(baseUrl ,'transaction' ,token);
  }
}