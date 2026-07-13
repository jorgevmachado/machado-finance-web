import { BffBaseServiceAbstract ,TBffResponse } from '@/app/shared';

import {
  TExpense ,
  TExpenseCreate ,
  TExpenseFilter ,TExpenseListPersist ,
  TExpenseUpdate ,
  TExpenseUpload ,
  TExpenseUploadResponse ,
} from '../types';

export class ExpenseBffService extends BffBaseServiceAbstract<TExpense ,TExpenseCreate ,TExpenseUpdate ,TExpenseFilter> {
  constructor(baseUrl: string) {
    super('expense' ,'expense' ,baseUrl);
  }

  public async upload(payload: TExpenseUpload): Promise<TBffResponse<TExpenseUploadResponse>> {
    const formData = new FormData();
    formData.append('file' ,payload.file);
    formData.append('bank' ,payload.bank);
    formData.append('allocation_id' ,payload.allocation_id);
    if (payload.reference_year !== undefined) {
      formData.append('reference_year' ,payload.reference_year.toString());
    }

    return await this.bff_post<FormData ,TExpenseUploadResponse>({
      param: 'upload' ,
      config: { body: formData } ,
      i18nMessageSuccess: `${ this.domain }.upload.success` ,
      i18nMessageError: `${ this.domain }.upload.error`,
    });
  }

  public async persistList(payload: TExpenseListPersist): Promise<TBffResponse<Array<TExpense>>> {
    return await this.bff_post<TExpenseListPersist ,Array<TExpense>>({
      param: 'persist-list' ,
      config: { body: payload } ,
      i18nMessageSuccess: `${ this.domain }.persist-list.success` ,
      i18nMessageError: `${ this.domain }.persist-list.error`,
    });
  }

}