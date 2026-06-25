import React from 'react';

import { FiltersProps } from '@/app/ds';

export type TPaginatedMeta = {
  total: number;
  limit: number;
  offset: number;
  next_page?: number;
  previous_page?: number;
  total_pages: number;
  current_page: number;
}

export type TPaginatedListResponse<T> = {
  items: Array<T>;
  meta: TPaginatedMeta;
}

export type PaginatedListState<TItem> = {
  items: TPaginatedListResponse<TItem>['items'];
  meta: TPaginatedListResponse<TItem>['meta'];
  isLoading: boolean;
  errorMessage?: string;
};

export type PaginatedListProps<TItem, TFilters> = {
  meta: TPaginatedListResponse<TItem>['meta'];
  title?: string;
  subtitle?: string;
  domain: string;
  goToPage?: (page: number) => void;
  children?: React.ReactNode;
  isLoading?: boolean;
  totalItems?: number;
  errorMessage?: string;
  inputFilters?: FiltersProps['filters'];
  applyInputFilters?: (nextFilters: TFilters) => void;
  clearInputFilters?: () => void;
};

export type UsePaginatedListProps<TFilters> = {
  endpoint: string;
  initialFilters: TFilters;
  buildQueryString?: (page: number, limit: number, filters: TFilters) => string;
  normalizeFilters: (nextFilters: TFilters) => TFilters;
  fetchErrorMessage?: string;
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