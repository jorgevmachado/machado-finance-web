'use client';
import { useCallback ,useEffect ,useMemo ,useState } from 'react';
import { type FiltersProps ,useAlert ,useLoading } from '@/app/ds';
import { buildQueryString ,useAppTranslation } from '@/app/shared';

import { UseDetailProps, UseDetailResult, DetailState } from './types';
import { buildInputFilterValueMap } from '@/app/ui';

const useDetail = <TItem>({
  identifier,
  fetchDetail,
  initialFilters,
  initialInputFilters,
  normalizeFilters,
  fetchErrorMessage = 'common.unknow'
}: UseDetailProps<TItem>): UseDetailResult<TItem> => {

  const { startContentLoading, stopContentLoading } = useLoading();
  const { showAlert } = useAlert();
  const { t } = useAppTranslation();

  const [state, setState] = useState<DetailState<TItem>>({
    data: undefined,
    isLoading: true,
    errorMessage: undefined,
  });

  const [filters, setFilters] = useState<Record<string, string | number> | undefined>(initialFilters);
  const [inputFilterValues, setInputFilterValues] = useState<Record<string, string | number> | undefined>(() => !initialInputFilters ? undefined : buildInputFilterValueMap(initialInputFilters));

  const inputFilters = useMemo<FiltersProps['filters']>(() => {
    if (!initialInputFilters) {
      return [];
    }
    return initialInputFilters.map((filter) => ({
      ...filter,
      value: inputFilterValues?.[filter.name] ?? '',
    }));
  }, [initialInputFilters, inputFilterValues]);

  const fetchPage = useCallback(async (activeFilters?: Record<string, string | number>) => {
    setState((previousState) => ({
      ...previousState,
      isLoading: true,
      errorMessage: undefined,
    }));
    startContentLoading();
    const tFetchErrorMessage = t(fetchErrorMessage);
    try {
      const queryString = buildQueryString(activeFilters);
      const response = await fetchDetail({ identifier, queryString });
      if (response.error && !response?.data) {
        const message = t(response.i18nMessageError);
        setState({ data: undefined, isLoading: false, errorMessage: message ?? tFetchErrorMessage });
        showAlert({ type: 'error', message });
        return;
      }
      setState({ data: response.data, isLoading: false, errorMessage: undefined });
    } catch (error) {
      const message = error instanceof Error && error.message ? error.message : tFetchErrorMessage;
      setState({ data: undefined, isLoading: false, errorMessage: message });
      showAlert({ type: 'error', message });
    } finally {
      stopContentLoading();
    }
  }, [fetchDetail, fetchErrorMessage, identifier, showAlert, startContentLoading, stopContentLoading, t]);

  const requestPage = useCallback((activeFilters?: Record<string, string | number>): void => {
    setState((previousState) => ({
      ...previousState,
      isLoading: true,
      errorMessage: undefined,
    }));
    startContentLoading();
    void fetchPage(activeFilters);
  }, [fetchPage, startContentLoading]);

  const normalizeDetailFilters = useCallback((nextFilters: Record<string, string | number>): Record<string, string | number> => {
    const normalizedFilters: Record<string, string | number> = {};
    for (const [key, value] of Object.entries(nextFilters)) {
      if (value !== undefined && value !== null && value !== '') {
        normalizedFilters[key] = value;
      }
    }
    return normalizedFilters;
  }, []);
  
  const applyFilters = useCallback((nextFilters: Record<string, string | number>) => {
    const normalizedFilters = !normalizeFilters ? normalizeDetailFilters(nextFilters) : normalizeFilters(nextFilters);

    setFilters(normalizedFilters);
    requestPage(normalizedFilters);
  }, [normalizeDetailFilters, normalizeFilters, requestPage]);

  const applyInputFilters = useCallback((nextFilters: Record<string, string | number>) => {
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
    requestPage( initialFilters);
  }, [initialFilters, requestPage]);

  const clearInputFilters = useCallback(() => {
    setInputFilterValues((previousState) => {
      if (!previousState) {
        return ;
      }
      return Object.fromEntries(
        Object.keys(previousState).map((key) => [key, '']),
      );
    });

    clearFilters();
  }, [clearFilters]);

  const updateInputFilters = useCallback((nextInputFilters: FiltersProps['filters']) => {
    setInputFilterValues(buildInputFilterValueMap(nextInputFilters));
  }, []);

  useEffect(() => {
    const timeoutId = globalThis.setTimeout(() => {
      void fetchPage(initialFilters);
    }, 0);

    return () => {
      globalThis.clearTimeout(timeoutId);
    };
  }, [fetchPage, initialFilters]);

  return {
    ...state,
    reload: fetchPage,
    filters,
    clearFilters,
    inputFilters,
    applyInputFilters,
    clearInputFilters,
    updateInputFilters,
  };
};
export default useDetail;