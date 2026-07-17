'use client';

import {
  useCallback ,
  useEffect ,
  useRef ,
  useState,
} from 'react';

import {
  type TPaginatedListResponse ,
  useAppTranslation,
} from '@/app/shared';

import {
  useLoading ,
  clampPage ,useFilter,
} from '@/app/ds';

import { UsePaginatedListResult ,UsePaginatedListProps, PaginatedListState } from './types';

import {
  createInitialState ,
} from './business';


const usePaginatedList = <TItem, TFilters>({
  initialFilters,
  fetchErrorMessage = 'error.fetchingData',
  normalizeFilters,
  fetchPaginatedList,
  initialInputFilters,
}: UsePaginatedListProps<TItem, TFilters>): UsePaginatedListResult<TItem, TFilters> => {
  const [state, setState] = useState<PaginatedListState<TItem>>(() => createInitialState<TItem>());

  const requestIdRef = useRef(0);
  const fetchPaginatedListRef = useRef(fetchPaginatedList);
  const { startContentLoading, stopContentLoading } = useLoading();
  const { t } = useAppTranslation();

  useEffect(() => {
    fetchPaginatedListRef.current = fetchPaginatedList;
  }, [fetchPaginatedList]);

  const fetchPage = useCallback(async (page: number, activeFilters: TFilters, perPage: number = 12): Promise<void> => {
    const requestId = requestIdRef.current + 1;
    requestIdRef.current = requestId;
    try {
      const fetchPaginatedList = fetchPaginatedListRef.current;

      const response = await fetchPaginatedList({ page, filters: activeFilters,  perPage });

      if (requestIdRef.current !== requestId) {
        return;
      }

      if (response.error && !response?.data) {
        const message = response.message;
        setState((previousState) => ({
          ...previousState,
          isLoading: false,
          errorMessage: message ?? fetchErrorMessage,
        }));
        return;
      }
      const data = response.data as TPaginatedListResponse<TItem>;
      const normalizedPage = clampPage(data.meta.current_page, data.meta.total_pages);

      setState({
        items: data.items,
        meta: {
          ...data.meta,
          current_page: normalizedPage,
        },
        isLoading: false,
        errorMessage: undefined,
      });

    } catch (error) {
      if (requestIdRef.current !== requestId) {
        return;
      }

      const errorMessage = error instanceof Error && error.message ? error.message : t(fetchErrorMessage);

      setState((previousState) => ({
        ...previousState,
        isLoading: false,
        errorMessage,
      }));
    } finally {
      stopContentLoading();
    }
  }, [fetchErrorMessage, stopContentLoading, t]);

  const requestPage = useCallback((page: number, activeFilters: TFilters, perPage: number = 12): void => {
    setState((previousState) => ({
      ...previousState,
      isLoading: true,
      errorMessage: undefined,
    }));
    startContentLoading();
    void fetchPage(page, activeFilters, perPage);
  }, [fetchPage, startContentLoading]);
  
  const {
    filters,
    applyFilters,
    clearFilters,
    inputFilters,
    clearInputFilters,
    applyInputFilters,
    updateInputFilters
  } = useFilter({
    fetchRequest: (nextFilters: TFilters) => requestPage(1, nextFilters),
    initialFilters,
    normalizeFilters,
    initialInputFilters
  });

  useEffect(() => {
    const timeoutId = globalThis.setTimeout(() => {
      startContentLoading();
      void fetchPage(1, initialFilters);
    }, 0);

    return () => {
      globalThis.clearTimeout(timeoutId);
    };
  }, [fetchPage, initialFilters, startContentLoading]);

  const goToPage = useCallback((page: number) => {
    const targetPage = clampPage(page, state.meta.total_pages);

    if (targetPage === state.meta.current_page || state.isLoading) {
      return;
    }

    requestPage(targetPage, filters);
  }, [filters, requestPage, state.isLoading, state.meta.current_page, state.meta.total_pages]);

  const reload = useCallback(() => {
    requestPage(state.meta.current_page, filters);
  }, [filters, requestPage, state.meta.current_page]);

  return {
    meta: state.meta,
    items: state.items,
    reload,
    filters,
    goToPage,
    isLoading: state.isLoading,
    inputFilters,
    applyFilters,
    clearFilters,
    errorMessage: state.errorMessage,
    applyInputFilters,
    clearInputFilters,
    updateInputFilters
  };
};
export default usePaginatedList;