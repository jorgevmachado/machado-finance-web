import { BaseServiceAbstract } from '@/app/shared';

import type {
  TExpense ,
  TExpenseCreate ,
  TExpenseUpload ,
  TExpenseUpdate,
} from '../types';

export class ExpenseService  extends BaseServiceAbstract<TExpense ,TExpenseCreate ,TExpenseUpdate> {
  constructor(baseUrl: string ,token?: string) {
    super(baseUrl ,'expenses' ,token);
  }

  public async upload(payload: TExpenseUpload): Promise<Array<TExpense>> {
    const formData = new FormData();
    formData.append('file', payload.file);
    formData.append('bank', payload.bank);
    formData.append('allocation_id', payload.allocation_id);
    if (payload.reference_year !== undefined) {
      formData.append('reference_year', payload.reference_year.toString());
    }
    return await this.post<FormData, Array<TExpense>>(`${this.pathUrl}/upload`, { body: formData });
  }
}