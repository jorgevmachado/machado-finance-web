import { BaseServiceAbstract } from '@/app/shared';

import type {
  TTransfer ,
  TTransferCreate ,
  TTransferUpdate,
} from '../types';

export class TransferService  extends BaseServiceAbstract<TTransfer ,TTransferCreate ,TTransferUpdate> {
  constructor(baseUrl: string ,token?: string) {
    super(baseUrl ,'transfers' ,token);
  }
}