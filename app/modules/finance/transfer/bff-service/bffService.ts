import { BffBaseServiceAbstract } from '@/app/shared';

import type {
  TTransfer ,
  TTransferCreate ,
  TTransferFilter ,
  TTransferUpdate,
} from '../types';

export class TransferBffService extends BffBaseServiceAbstract<TTransfer, TTransferCreate, TTransferUpdate, TTransferFilter> {
  constructor(baseUrl: string) {
    super('transfer', 'transfers', baseUrl);
  }
}