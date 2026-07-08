import { ActionState } from '@/app/modules/actions/state';
import { FiltersProps } from '@/app/ds';

import type { TIncome ,TDraftIncome, TIncomeFilter } from '../types';
import { monthBusiness } from '@/app/modules/finance';

export class IncomeBusiness {
  public INITIAL_FILTERS: TIncomeFilter = {
    source: undefined,
    account_id: undefined,
    reference_year: undefined,
    reference_month: undefined,
  };

  public INITIAL_INPUT_FILTERS: FiltersProps['filters'] = [
    {
      name: 'source' ,
      label: 'income.source' ,
      type: 'text' ,
      value: '' ,
      placeholder: 'income.form.placeholder.source' ,
    } ,
    {
      name: 'reference_year' ,
      label: 'filters.year' ,
      type: 'number' ,
      value: '',
      placeholder: 'filters.yearPlaceholder' ,
    },
    {
      name: 'reference_month' ,
      label: 'filters.month' ,
      type: 'autocomplete' ,
      value: '' ,
      options: monthBusiness.MONTH_KEYS.map((key) => ({
        key: key,
        value: key,
        label: `month.${key}`
      })),
      placeholder: 'filters.monthPlaceholder' ,
    } ,
  ];
  
  public normalizeFilters(filters: TIncomeFilter): TIncomeFilter {
    return {
      source: filters.source?.trim() || undefined,
      account_id: filters.account_id || undefined,
      reference_year: filters.reference_year || undefined,
      reference_month: filters.reference_month || undefined,
    };
  }

  public getResponseMessage(actionState: ActionState) {
    return `income.${actionState.status}.${actionState.type}`;
  }
  
  public getOriginal(items: Array<TIncome>, tableItem: unknown): TIncome | undefined {
    const itemId = (tableItem as TIncome)?.id;
    return items?.find((item) => item.id === itemId);
  }

  public initDraft(income?: TIncome): TDraftIncome {
    return {
      source: income?.source || '',
      description: income?.description || '',
      account_id: income?.account_id || '',
    };
  }
} 