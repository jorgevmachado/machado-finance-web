import { BaseServiceAbstract } from '@/app/shared';

import {
  TExpense ,
  TExpenseCreate ,
  TExpenseUpload ,
  TExpenseUpdate ,
  TExpenseUploadResponse ,TExpenseListPersist ,
} from '../types';

export class ExpenseService  extends BaseServiceAbstract<TExpense ,TExpenseCreate ,TExpenseUpdate> {
  constructor(baseUrl: string ,token?: string) {
    super(baseUrl ,'expenses' ,token);
  }

  public async upload(payload: TExpenseUpload): Promise<TExpenseUploadResponse> {
    const formData = new FormData();
    formData.append('file', payload.file);
    formData.append('bank', payload.bank);
    formData.append('allocation_id', payload.allocation_id);
    if (payload.reference_year !== undefined) {
      formData.append('reference_year', payload.reference_year.toString());
    }
    return await this.post<FormData, TExpenseUploadResponse>(`${this.pathUrl}/upload`, { body: formData });
  }

  public async persistList(payload: TExpenseListPersist): Promise<Array<TExpense>> {
    return await this.post<TExpenseListPersist, Array<TExpense>>(`${this.pathUrl}/persist-list`, { body: payload });
  }
}