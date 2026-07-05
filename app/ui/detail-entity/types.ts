import type { TBffResponse, TBffDetailParams } from '@/app/shared';

import { FiltersProps } from '@/app/ds';

type FetchDetailFn<TItem> = (params: TBffDetailParams) => Promise<TBffResponse<TItem>>;

export type DetailState<TItem> = {
  data?: TItem;
  isLoading: boolean;
  errorMessage?: string;
}

export type UseDetailProps<TItem> = {
  identifier: string;
  fetchDetail: FetchDetailFn<TItem>;
  initialFilters?: Record<string, string | number>;
  normalizeFilters?: (nextFilters: Record<string, string | number>) => Record<string, string | number>;
  fetchErrorMessage?: string;
  initialInputFilters?: FiltersProps['filters'];
}

export type UseDetailResult<TItem> = DetailState<TItem> & {
  reload: () => Promise<void>;
  filters?: Record<string, string | number>;
  inputFilters?: FiltersProps['filters'];
  applyFilters?: (nextFilters: Record<string, string | number>) => void;
  clearFilters?: () => void;
  applyInputFilters?: (nextFilters: Record<string, string | number>) => void;
  clearInputFilters?: () => void;
  updateInputFilters: (inputFilters: FiltersProps['filters']) => void;
}