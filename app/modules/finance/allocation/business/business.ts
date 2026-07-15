import { ActionState } from '@/app/modules/actions/state';
import { FiltersProps } from '@/app/ds';

import type {
  TAllocation ,
  TDraftAllocation ,
  TAllocationFilter ,
} from '../types';

export class AllocationBusiness {
  public INITIAL_FILTERS: TAllocationFilter = {
    name: undefined,
    is_active: undefined,
    account_id: undefined,
    reference_year: undefined,
  };

  public INITIAL_INPUT_FILTERS: FiltersProps['filters'] = [
    {
      name: 'name' ,
      label: 'filters.name' ,
      type: 'text' ,
      value: '' ,
      placeholder: 'filters.namePlaceholder' ,
    } ,
    {
      name: 'reference_year' ,
      label: 'filters.year' ,
      type: 'number' ,
      value: '',
      placeholder: 'filters.yearPlaceholder' ,
    },
  ];

  public normalizeFilters(filters?: TAllocationFilter): TAllocationFilter {
    return {
      name: filters?.name?.trim() || undefined,
      is_active: filters?.is_active !== undefined ? filters?.is_active : undefined,
      account_id: filters?.account_id || undefined,
      reference_year: filters?.reference_year || undefined,
    };
  }

  public getResponseMessage(actionState: ActionState) {
    return `allocation.messages.${actionState.status}.${actionState.type}`;
  }

  public getOriginal(items: Array<TAllocation>, tableItem: unknown): TAllocation | undefined {
    const itemId = (tableItem as TAllocation)?.id;
    return items?.find((item) => item.id === itemId);
  }

  public initDraft(item?: TAllocation): TDraftAllocation {
    return {
      name: item?.name || '',
      description: item?.description || '',
      account_id: item?.account_id || '',
    };
  }
}