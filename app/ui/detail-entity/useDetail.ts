'use client';
import { useCallback ,useEffect ,useRef ,useState } from 'react';
import { useAlert ,useFilter ,useLoading } from '@/app/ds';
import { buildQueryString ,useAppTranslation } from '@/app/shared';

import { DetailState ,UseDetailProps ,UseDetailResult } from './types';

const useDetail = <TItem ,TFilters>({
  identifier ,
  fetchDetail ,
  initialFilters = {} as TFilters ,
  initialInputFilters = [] ,
  normalizeFilters ,
  fetchErrorMessage = 'common.unknow',
}: UseDetailProps<TItem ,TFilters>): UseDetailResult<TItem ,TFilters> => {
  const requestIdRef = useRef(0);
  const fetchDetailRef = useRef(fetchDetail);

  const { startContentLoading ,stopContentLoading } = useLoading();
  const { showAlert } = useAlert();
  const { t } = useAppTranslation();

  useEffect(() => {
    fetchDetailRef.current = fetchDetail;
  } ,[fetchDetail]);

  const [state ,setState] = useState<DetailState<TItem>>({
    data: undefined ,
    isLoading: true ,
    errorMessage: undefined ,
  });

  const fetchPage = useCallback(async (activeFilters?: TFilters) => {
    const requestId = requestIdRef.current + 1;
    requestIdRef.current = requestId;
    setState((previousState) => ({
      ...previousState ,
      isLoading: true ,
      errorMessage: undefined ,
    }));
    const tFetchErrorMessage = t(fetchErrorMessage);
    try {
      const fetchDetail = fetchDetailRef.current;
      const queryString = activeFilters ? buildQueryString(activeFilters) : '';
      const response = await fetchDetail({ identifier ,queryString });

      if (requestIdRef.current !== requestId) {
        return;
      }

      if (response.error && !response?.data) {
        const message = t(response.i18nMessageError);
        setState({
          data: undefined ,
          isLoading: false ,
          errorMessage: message ?? tFetchErrorMessage,
        });
        showAlert({ type: 'error' ,message });
        return;
      }
      setState(
        { data: response.data ,isLoading: false ,errorMessage: undefined });
    } catch (error) {
      if (requestIdRef.current !== requestId) {
        return;
      }
      const message = error instanceof Error && error.message ?
        error.message :
        tFetchErrorMessage;
      setState({ data: undefined ,isLoading: false ,errorMessage: message });
      showAlert({ type: 'error' ,message });
    } finally {
      stopContentLoading();
    }
  } ,[fetchErrorMessage ,identifier ,showAlert ,stopContentLoading ,t]);

  const requestPage = useCallback((activeFilters?: TFilters): void => {
    setState((previousState) => ({
      ...previousState ,
      isLoading: true ,
      errorMessage: undefined ,
    }));
    startContentLoading();
    void fetchPage(activeFilters);
  } ,[fetchPage ,startContentLoading]);

  const {
    filters ,
    applyFilters ,
    clearFilters ,
    inputFilters ,
    clearInputFilters ,
    applyInputFilters ,
    updateInputFilters,
  } = useFilter<TFilters>({
    fetchRequest: (nextFilters: TFilters) => requestPage(nextFilters) ,
    initialFilters ,
    normalizeFilters ,
    initialInputFilters,
  });

  useEffect(() => {
    const timeoutId = globalThis.setTimeout(() => {
      startContentLoading();
      void fetchPage(initialFilters);
    } ,0);

    return () => {
      globalThis.clearTimeout(timeoutId);
    };
  } ,[fetchPage ,startContentLoading]);

  return {
    ...state ,
    reload: fetchPage ,
    filters ,
    applyFilters ,
    clearFilters ,
    inputFilters ,
    applyInputFilters ,
    clearInputFilters ,
    updateInputFilters ,
  };
};
export default useDetail;