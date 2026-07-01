import { BaseServiceAbstract } from '@/app/shared';
import type {
  TAccount ,
  TAccountCreate ,
  TAccountUpdate,
} from '../types';

export class AccountService extends BaseServiceAbstract<TAccount, TAccountCreate, TAccountUpdate> {
  constructor(baseUrl: string ,token?: string) {
    super(baseUrl ,'accounts' ,token);
  }

  public async recalculate(identifier: string): Promise<TAccount> {
    return this.get<TAccount>(`${this.pathUrl}/${identifier}/recalculate`);
  }
}