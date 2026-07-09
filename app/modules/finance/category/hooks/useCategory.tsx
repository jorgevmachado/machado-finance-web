'use client';
import { useCallback ,useRef ,useState } from 'react';
import { useAppTranslation } from '@/app/shared';
import { useLoading } from '@/app/ds';

import { financeBffService } from '@/app/modules/finance';

import type { TCategory, TCategoryFilter } from '../types';

type CategoryState = {
  items: Array<TCategory>;
  isLoading: boolean;
  errorMessage?: string;
}

type UseCategoryResult = CategoryState & {
  fetchList: (filters?: TCategoryFilter) => Promise<void>;
};

const useCategory = (): UseCategoryResult => {
  const { t } = useAppTranslation();
  const { startContentLoading, stopContentLoading } = useLoading();
  const requestIdRef = useRef(0);
  const [state, setState] = useState<CategoryState>({
    items: [],
    isLoading: false,
    errorMessage: undefined,
  });
  
  const fetchList = useCallback( async (filters?: TCategoryFilter) => {
    startContentLoading();
    const requestId = requestIdRef.current + 1;
    requestIdRef.current = requestId;
    try {

      const response = await financeBffService.category.list({ filters: filters ?? {} });

      if (requestIdRef.current !== requestId) {
        return;
      }

      if (response.error && !response?.data) {
        const message = response.message || t(response.i18nMessageError);
        setState((previousState) => ({
          ...previousState,
          isLoading: false,
          errorMessage: message ?? t('category.error.fetchingData'),
        }));
        return;
      }
      const data = response.data as Array<TCategory>;

      setState({
        items: data,
        isLoading: false,
        errorMessage: undefined,
      });

    } catch (error) {
      if (requestIdRef.current !== requestId) {
        return;
      }

      const errorMessage = error instanceof Error && error.message ? error.message : t('category.error.fetchingData');

      setState((previousState) => ({
        ...previousState,
        isLoading: false,
        errorMessage,
      }));
    } finally {
      stopContentLoading();
    }
  }, [startContentLoading, stopContentLoading, t]);

  return {
    ...state,
    fetchList,
  };
};
export default useCategory;