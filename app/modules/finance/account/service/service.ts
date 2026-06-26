import { BaseServiceAbstract } from '@/app/shared';
import type {
  TAccount ,
  TAccountCreate ,
  TAccountUpdate,
} from '../types';

export class AccountService extends BaseServiceAbstract<TAccount, TAccountCreate, TAccountUpdate> {
  constructor(baseUrl: string ,token?: string) {
    super(baseUrl ,'account' ,token);
  }
}