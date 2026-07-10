import { BffBaseServiceAbstract ,TBffResponse } from '@/app/shared';

import {
  TExpense ,TExpenseCreate ,TExpenseUpdate ,TExpenseFilter ,
  TExpenseUpload,
} from '../types';

export class ExpenseBffService extends BffBaseServiceAbstract<TExpense, TExpenseCreate, TExpenseUpdate, TExpenseFilter> {
  constructor(baseUrl: string) {
    super('expense', 'expense', baseUrl);
  }

  public async upload(payload: TExpenseUpload): Promise<TBffResponse<Array<TExpense>>> {
    const formData = new FormData();
    formData.append('file', payload.file);
    formData.append('bank', payload.bank);
    formData.append('allocation_id', payload.allocation_id);
    if (payload.reference_year !== undefined) {
      formData.append('reference_year', payload.reference_year.toString());
    }

    return await this.bff_post<FormData, Array<TExpense>>({
      param: 'upload',
      config: { body: formData },
      i18nMessageSuccess: `${this.domain}.upload.success`,
      i18nMessageError: `${this.domain}.upload.error`
    });
  }

}