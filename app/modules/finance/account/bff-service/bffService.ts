import { BffBaseServiceAbstract ,TBffResponse } from '@/app/shared';

import type {
  TAccount ,
  TAccountCreate ,
  TAccountFilter ,
  TAccountUpdate,
} from '../types';

export class AccountBffService extends BffBaseServiceAbstract<TAccount, TAccountCreate, TAccountUpdate, TAccountFilter> {
  constructor(baseUrl: string) {
    super('account', 'account', baseUrl);
  }

  public async recalculate(identifier: string): Promise<TBffResponse<TAccount>> {
    return this.get<TBffResponse<TAccount>>(`${this.pathUrl}/${identifier}/recalculate`);
  }
}