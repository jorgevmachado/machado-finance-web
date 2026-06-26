import type { TPaginatedMeta } from '@/app/shared';

import { type FiltersProps } from '@/app/ds';

import { PaginatedListState } from './types';

export const INITIAL_PAGINATION: TPaginatedMeta = {
  total: 0,
  limit: 10,
  offset: 0,
  next_page: undefined,
  previous_page: undefined,
  total_pages: 0,
  current_page: 1,
};

export const createInitialState = <TItem,>(): PaginatedListState<TItem> => ({
  items: [],
  meta: INITIAL_PAGINATION,
  isLoading: true,
  errorMessage: undefined,
});

export const buildInputFilterValueMap = (filters: FiltersProps['filters']): Record<string, string> => {
  return Object.fromEntries(
    filters.map((filter) => [filter.name, filter.value]),
  );
};