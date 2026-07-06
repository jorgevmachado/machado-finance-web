import type { TBffResponse, TBffDetailParams } from '@/app/shared';

import { FiltersProps } from '@/app/ds';

type FetchDetailFn<TItem> = (params: TBffDetailParams) => Promise<TBffResponse<TItem>>;

export type DetailState<TItem> = {
  data?: TItem;
  isLoading: boolean;
  errorMessage?: string;
}

export type UseDetailProps<TItem, TFilters> = {
  identifier: string;
  fetchDetail: FetchDetailFn<TItem>;
  initialFilters?: TFilters;
  normalizeFilters?: (nextFilters?: TFilters) => TFilters;
  fetchErrorMessage?: string;
  initialInputFilters?: FiltersProps['filters'];
}

export type UseDetailResult<TItem, TFilters> = DetailState<TItem> & {
  reload: () => Promise<void>;
  filters?: TFilters;
  inputFilters?: FiltersProps['filters'];
  applyFilters?: (nextFilters: TFilters) => void;
  clearFilters?: () => void;
  applyInputFilters?: (nextFilters: TFilters) => void;
  clearInputFilters?: () => void;
  updateInputFilters: (inputFilters: FiltersProps['filters']) => void;
}