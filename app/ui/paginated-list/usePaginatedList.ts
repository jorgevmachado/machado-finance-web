'use client';

import {
  useCallback ,
  useEffect ,
  useMemo ,
  useRef ,
  useState,
} from 'react';

import {
  buildQueryString ,
  type TPaginatedListResponse ,
  useAppTranslation,
} from '@/app/shared';

import {
  type FiltersProps ,
  useLoading,
  clampPage
} from '@/app/ds';

import { UsePaginatedListResult ,UsePaginatedListProps, PaginatedListState } from './types';

import {
  buildInputFilterValueMap ,
  createInitialState ,
} from './business';


const usePaginatedList = <TItem, TFilters>({
  endpoint,
  initialFilters,
  fetchErrorMessage = 'error.fetchingData',
  buildQueryString: buildQueryStringOverride,
  normalizeFilters,
  initialInputFilters
}: UsePaginatedListProps<TFilters>): UsePaginatedListResult<TItem, TFilters> => {
  const [state, setState] = useState<PaginatedListState<TItem>>(() => createInitialState<TItem>());
  const [filters, setFilters] = useState<TFilters>(initialFilters);
  const [inputFilterValues, setInputFilterValues] = useState<Record<string, string>>(() => buildInputFilterValueMap(initialInputFilters));
  const requestIdRef = useRef(0);
  const endpointRef = useRef(endpoint);
  const buildQueryStringRef = useRef(buildQueryStringOverride);
  const { startContentLoading, stopContentLoading } = useLoading();
  const { t } = useAppTranslation();

  useEffect(() => {
    endpointRef.current = endpoint;
    buildQueryStringRef.current = buildQueryStringOverride;
  }, [buildQueryStringOverride, endpoint]);

  const inputFilters = useMemo<FiltersProps['filters']>(() => {
    return initialInputFilters.map((filter) => ({
      ...filter,
      value: inputFilterValues[filter.name] ?? '',
    }));
  }, [initialInputFilters, inputFilterValues]);

  const fetchPage = useCallback(async (page: number, activeFilters: TFilters, perPage: number = 12): Promise<void> => {
    const requestId = requestIdRef.current + 1;
    requestIdRef.current = requestId;
    try {
      const currentEndpoint = endpointRef.current;

      const queryString = buildQueryStringRef.current
        ? buildQueryStringRef.current(page, perPage, activeFilters)
        : buildQueryString(activeFilters, page, perPage);

      const path = queryString === '' ? currentEndpoint : `${currentEndpoint}?${queryString}`;
      const fetchResponse = await fetch(`/api/${path}`, {
        method: 'GET',
        cache: 'no-store',
      });

      const json = await fetchResponse.json() as TPaginatedListResponse<TItem> | { message?: string };

      const response = !fetchResponse.ok || !('items' in json)
        ? {
          error: true,
          status: fetchResponse.status,
          message: 'message' in json && json.message ? json.message : fetchErrorMessage,
          i18nMessage: fetchErrorMessage,
        }
        : {
          error: false,
          status: fetchResponse.status,
          message: 'OK',
          i18nMessage: fetchErrorMessage,
          data: json,
        };

      if (requestIdRef.current !== requestId) {
        return;
      }

      if (response.error && !response?.data) {
        const message = response.message || t(response.i18nMessage);
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

  const applyFilters = useCallback((nextFilters: TFilters) => {
    const normalizedFilters = normalizeFilters(nextFilters);

    setFilters(normalizedFilters);
    requestPage(1, normalizedFilters);
  }, [normalizeFilters, requestPage]);

  const applyInputFilters = useCallback((nextFilters: TFilters) => {
    const filterValues = nextFilters as Record<string, string | undefined>;
    setInputFilterValues((previousState) => {
      const nextState = { ...previousState };

      for (const key of Object.keys(nextState)) {
        nextState[key] = filterValues[key] || '';
      }

      return nextState;
    });

    applyFilters(nextFilters);
  }, [applyFilters]);

  const clearFilters = useCallback(() => {
    setFilters(initialFilters);
    requestPage(1, initialFilters);
  }, [initialFilters, requestPage]);

  const clearInputFilters = useCallback(() => {
    setInputFilterValues((previousState) => {
      return Object.fromEntries(
        Object.keys(previousState).map((key) => [key, '']),
      );
    });

    clearFilters();
  }, [clearFilters]);

  const updateInputFilters = useCallback((nextInputFilters: FiltersProps['filters']) => {
    setInputFilterValues(buildInputFilterValueMap(nextInputFilters));
  }, []);

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