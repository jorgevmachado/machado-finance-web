import { ActionState } from '@/app/modules/actions/state';
import { FiltersProps } from '@/app/ds';

import { CATEGORY_TYPES } from '../constants';
import type { TCategory ,TDraftCategory, TCategoryFilter } from '../types';

export class CategoryBusiness {
  public INITIAL_FILTERS: TCategoryFilter = {
    name: undefined,
    type: undefined,
  };

  public INITIAL_INPUT_FILTERS: FiltersProps['filters'] = [
    {
      name: 'name' ,
      label: 'filters.name' ,
      type: 'text' ,
      value: '' ,
      placeholder: 'category.form.placeholder.name' ,
    } ,
    {
      name: 'type' ,
      label: 'filters.type' ,
      type: 'autocomplete' ,
      value: '' ,
      options: CATEGORY_TYPES.map((type) => ({
        key: type,
        value: type,
        label: `category.types.${type}`
      })),
      placeholder: 'category.form.placeholder.type' ,
    } ,
  ];
  
  public normalizeFilters(filters?: TCategoryFilter): TCategoryFilter {
    return {
      name: filters?.name?.trim() || undefined,
      type: filters?.type || undefined,
    };
  }

  public getResponseMessage(actionState: ActionState) {
    return `category.${actionState.status}.${actionState.type}`;
  }
  
  public getOriginal(items: Array<TCategory>, tableItem: unknown): TCategory | undefined {
    const itemId = (tableItem as TCategory)?.id;
    return items?.find((item) => item.id === itemId);
  }

  public initDraft(category?: TCategory): TDraftCategory {
    return {
      name: category?.name || '',
      type: category?.type || '',
      description: category?.description || '',
    };
  }
} 