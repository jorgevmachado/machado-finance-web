import { type TCategoryFilter } from '@/app/modules/finance';
import { ActionState } from '@/app/actions/state';

export class CategoryBusiness {
  public INITIAL_FILTERS: TCategoryFilter = {
    name: undefined,
    type: undefined,
  };
  
  public normalizeFilters(filters: TCategoryFilter): TCategoryFilter {
    return {
      name: filters.name?.trim() || undefined,
      type: filters.type || undefined,
    };
  }

  public getResponseMessage(actionState: ActionState) {
    return `category.${actionState.status}.${actionState.type}`;
  }
} 