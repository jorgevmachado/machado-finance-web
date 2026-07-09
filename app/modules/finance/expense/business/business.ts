import { FiltersProps } from '@/app/ds';

import { ActionState } from '@/app/modules/actions/state';

import { monthBusiness } from '@/app/modules/finance';

import type {
  TExpense ,
  TDraftExpense ,
  TExpenseFilter ,
} from '../types';


export class ExpenseBusiness {
  public INITIAL_FILTERS: TExpenseFilter = {
    payee: undefined,
    category_id: undefined,
    allocation_id: undefined,
    reference_year: undefined,
    reference_month: undefined,
  };

  public INITIAL_INPUT_FILTERS: FiltersProps['filters'] = [
    {
      name: 'payee' ,
      label: 'expense.payee' ,
      type: 'text' ,
      value: '' ,
      placeholder: 'expense.form.placeholder.payee' ,
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
  
  public normalizeFilters(filters: TExpenseFilter): TExpenseFilter {
    return {
      payee: filters.payee?.trim() || undefined,
      category_id: filters.category_id || undefined,
      allocation_id: filters.allocation_id || undefined,
      reference_year: filters.reference_year || undefined,
      reference_month: filters.reference_month || undefined,
    };
  }

  public getResponseMessage(actionState: ActionState) {
    return `expense.${actionState.status}.${actionState.type}`;
  }
  
  public getOriginal(items: Array<TExpense>, tableItem: unknown): TExpense | undefined {
    const itemId = (tableItem as TExpense)?.id;
    return items?.find((item) => item.id === itemId);
  }

  public initDraft(referenceYear: number, expense?: TExpense): TDraftExpense {
    return {
      payee: expense?.payee || '',
      category_id: expense?.category?.id || '',
      description: expense?.description || '',
      allocation_id: expense?.allocation?.id || '',
      reference_year: referenceYear,
    };
  }
} 