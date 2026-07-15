import { FiltersProps } from '@/app/ds';

import { ActionState } from '@/app/modules/actions/state';

import { monthBusiness } from '@/app/modules/finance';

import type {
  TAllocationContribution ,
  TAllocationContributionFilter ,
  TDraftAllocationContribution ,
} from '../types';


export class AllocationContributionBusiness {
  public INITIAL_FILTERS: TAllocationContributionFilter = {
    allocation_id: undefined,
    reference_year: undefined,
    reference_month: undefined,
    contributor_name: undefined,
  };

  public INITIAL_INPUT_FILTERS: FiltersProps['filters'] = [
    {
      name: 'contributor_name' ,
      label: 'allocation-contribution.payee' ,
      type: 'text' ,
      value: '' ,
      placeholder: 'allocation-contribution.form.placeholder.payee' ,
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
  
  public normalizeFilters(filters?: TAllocationContributionFilter): TAllocationContributionFilter {
    return {
      allocation_id: filters?.allocation_id || undefined,
      reference_year: filters?.reference_year || undefined,
      reference_month: filters?.reference_month || undefined,
      contributor_name: filters?.contributor_name || undefined,
    };
  }

  public getResponseMessage(actionState: ActionState) {
    return `allocation-contribution.messages.${actionState.status}.${actionState.type}`;
  }
  
  public getOriginal(items: Array<TAllocationContribution>, tableItem: unknown): TAllocationContribution | undefined {
    const itemId = (tableItem as TAllocationContribution)?.id;
    return items?.find((item) => item.id === itemId);
  }

  public initDraft(referenceYear: number, item?: TAllocationContribution): TDraftAllocationContribution {
    return {
      description: item?.description || '',
      allocation_id: item?.allocation?.id || '',
      reference_year: referenceYear,
      contributor_name: item?.contributor_name || '',
    };
  }
} 