import { type TCategoryFilter } from '@/app/modules/finance';

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
} 