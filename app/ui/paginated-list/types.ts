import React from 'react';

import type {
  TBffListPaginateParams ,
  TBffResponse ,
  TPaginatedListResponse,
} from '@/app/shared';

import { FiltersProps } from '@/app/ds';

export type PaginatedListState<TItem> = {
  items: TPaginatedListResponse<TItem>['items'];
  meta: TPaginatedListResponse<TItem>['meta'];
  isLoading: boolean;
  errorMessage?: string;
};

export type PaginatedAction= {
  label: string;
  onClick: (item: unknown) => void;
}

export type PaginatedListProps<TItem, TFilters> = {
  meta: TPaginatedListResponse<TItem>['meta'];
  title?: string;
  domain: string;
  action?: PaginatedAction;
  subtitle?: string;
  goToPage?: (page: number) => void;
  children?: React.ReactNode;
  isLoading?: boolean;
  totalItems?: number;
  errorMessage?: string;
  inputFilters?: FiltersProps['filters'];
  applyInputFilters?: (nextFilters: TFilters) => void;
  clearInputFilters?: () => void;
};

type FetchPaginatedListFn<TItem, TFilters> = (params: TBffListPaginateParams<TFilters>) => Promise<TBffResponse<TPaginatedListResponse<TItem>>>;

export type UsePaginatedListProps<TItem, TFilters> = {
  initialFilters: TFilters;
  normalizeFilters: (nextFilters: TFilters) => TFilters;
  fetchErrorMessage?: string;
  fetchPaginatedList: FetchPaginatedListFn<TItem, TFilters>;
  initialInputFilters: FiltersProps['filters'];
};

export type UsePaginatedListResult<TItem, TFilters> = {
  meta: TPaginatedListResponse<TItem>['meta'];
  items: TPaginatedListResponse<TItem>['items'];
  reload: () => void;
  filters: TFilters;
  goToPage: (page: number) => void;
  isLoading: boolean;
  inputFilters: FiltersProps['filters'];
  applyFilters: (nextFilters: TFilters) => void;
  clearFilters: () => void;
  errorMessage?: string;
  applyInputFilters: (nextFilters: TFilters) => void;
  clearInputFilters: () => void;
  updateInputFilters: (inputFilters: FiltersProps['filters']) => void;
};

export type TPaginateBaseFilter = {
  page?: string;
  limit?: string
  clean_cache?: boolean;
  with_deleted?: boolean;
}