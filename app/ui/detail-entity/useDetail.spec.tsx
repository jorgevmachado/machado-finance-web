import { act, renderHook, waitFor } from '@testing-library/react';

import type { FiltersProps } from '@/app/ds';
import type { TBffDetailParams, TBffResponse } from '@/app/shared';

const startContentLoading = jest.fn();
const stopContentLoading = jest.fn();
const showAlert = jest.fn();
const translate = jest.fn((key?: string) => (key ? `translated:${key}` : undefined));

jest.mock('@/app/shared', () => {
  return {
    buildQueryString: (query?: Record<string, string | number | undefined>) => {
      if (!query) return '';
      const params = new URLSearchParams();
      for (const [key, value] of Object.entries(query)) {
        if (value !== undefined && value !== null && value !== '') {
          params.set(key, String(value));
        }
      }
      return params.toString();
    },
    useAppTranslation: () => ({
      t: translate,
    }),
  };
});

jest.mock('@/app/ds', () => {
  const React = require('react') as typeof import('react');

  return {
    useAlert: () => ({
      showAlert,
    }),
    useLoading: () => ({
      startContentLoading,
      stopContentLoading,
    }),
    useFilter: <TFilters,>({
      fetchRequest,
      initialFilters,
      normalizeFilters,
      initialInputFilters,
    }: {
      fetchRequest: (filters: TFilters) => void;
      initialFilters: TFilters;
      normalizeFilters?: (nextFilters?: TFilters) => TFilters;
      initialInputFilters: FiltersProps['filters'];
    }) => {
      const [filters, setFilters] = React.useState<TFilters>(initialFilters);
      const [inputFilters, setInputFilters] = React.useState<FiltersProps['filters']>(initialInputFilters);

      const applyFilters = (nextFilters: TFilters) => {
        const normalizedFilters = normalizeFilters ? normalizeFilters(nextFilters) : nextFilters;
        setFilters(normalizedFilters);
        fetchRequest(normalizedFilters);
      };

      const clearFilters = () => {
        setFilters(initialFilters);
        fetchRequest(initialFilters);
      };

      const applyInputFilters = (nextFilters: TFilters) => {
        setInputFilters((previousInputFilters) => (
          previousInputFilters.map((filter) => ({
            ...filter,
            value: (nextFilters as Record<string, string | number | undefined>)[filter.name] ?? '',
          }))
        ));
        applyFilters(nextFilters);
      };

      const clearInputFilters = () => {
        setInputFilters((previousInputFilters) => (
          previousInputFilters.map((filter) => ({
            ...filter,
            value: '',
          }))
        ));
        clearFilters();
      };

      const updateInputFilters = (nextInputFilters: FiltersProps['filters']) => {
        setInputFilters(nextInputFilters);
      };

      return {
        filters,
        applyFilters,
        clearFilters,
        inputFilters,
        clearInputFilters,
        applyInputFilters,
        updateInputFilters,
      };
    },
  };
});

import useDetail from './useDetail';

type DetailItem = {
  id: string;
  name: string;
};

type DetailFilters = {
  name: string;
  status: string;
};

const initialInputFilters: FiltersProps['filters'] = [
  { name: 'name', label: 'Name', type: 'text', value: '', placeholder: 'Name' },
  { name: 'status', label: 'Status', type: 'text', value: '', placeholder: 'Status' },
];

const createDeferred = <T,>() => {
  let resolve!: (value: T) => void;
  let reject!: (error: unknown) => void;

  const promise = new Promise<T>((resolvePromise, rejectPromise) => {
    resolve = resolvePromise;
    reject = rejectPromise;
  });

  return {
    promise,
    resolve,
    reject,
  };
};

describe('useDetail', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    translate.mockImplementation((key?: string) => (key ? `translated:${key}` : undefined));
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('loads the initial detail and wires filter helpers', async () => {
    const fetchDetail = jest.fn<Promise<TBffResponse<DetailItem>>, [TBffDetailParams]>()
      .mockResolvedValue({
        data: { id: '1', name: 'Entity' },
        error: false,
        status: 200,
        message: 'ok',
        i18nMessageError: 'detail.error',
        i18nMessageSuccess: 'detail.success',
      });

    const { result } = renderHook(() =>
      useDetail<DetailItem, DetailFilters>({
        identifier: 'entity-1',
        fetchDetail,
        initialFilters: { name: '', status: '' },
        initialInputFilters,
        normalizeFilters: (nextFilters) => ({
          name: nextFilters?.name.trim() ?? '',
          status: nextFilters?.status.trim() ?? '',
        }),
        fetchErrorMessage: 'detail.fetch.error',
      }),
    );

    act(() => {
      jest.runOnlyPendingTimers();
    });

    await waitFor(() => {
      expect(fetchDetail).toHaveBeenCalledWith({
        identifier: 'entity-1',
        queryString: '',
      });
      expect(result.current.data).toEqual({ id: '1', name: 'Entity' });
      expect(result.current.isLoading).toBe(false);
    });

    await act(async () => {
      await result.current.reload();
    });

    await waitFor(() => {
      expect(fetchDetail).toHaveBeenLastCalledWith({
        identifier: 'entity-1',
        queryString: '',
      });
    });

    await act(async () => {
      result.current.applyFilters?.({ name: '  Ash  ', status: 'active' });
    });

    await waitFor(() => {
      expect(fetchDetail).toHaveBeenLastCalledWith({
        identifier: 'entity-1',
        queryString: 'name=Ash&status=active',
      });
    });

    await act(async () => {
      result.current.applyInputFilters?.({ name: '  Misty  ', status: '' });
    });

    await waitFor(() => {
      expect(fetchDetail).toHaveBeenLastCalledWith({
        identifier: 'entity-1',
        queryString: 'name=Misty',
      });
      expect(result.current.inputFilters?.[0].value).toBe('  Misty  ');
    });

    act(() => {
      result.current.clearInputFilters?.();
    });

    await waitFor(() => {
      expect(fetchDetail).toHaveBeenLastCalledWith({
        identifier: 'entity-1',
        queryString: '',
      });
      expect(result.current.inputFilters?.[0].value).toBe('');
    });

    act(() => {
      result.current.updateInputFilters([
        { name: 'name', label: 'Name', type: 'text', value: 'manual', placeholder: 'Name' },
        { name: 'status', label: 'Status', type: 'text', value: 'updated', placeholder: 'Status' },
      ]);
    });

    expect(result.current.inputFilters?.[0].value).toBe('manual');
    expect(result.current.inputFilters?.[1].value).toBe('updated');

    expect(startContentLoading).toHaveBeenCalled();
    expect(stopContentLoading).toHaveBeenCalled();
  });

  it('uses the translated fetch error message when the API returns error without data', async () => {
    translate.mockImplementation((key?: string) => {
      if (key === 'detail.response.error') {
        return undefined;
      }

      return key ? `translated:${key}` : undefined;
    });

    const fetchDetail = jest.fn<Promise<TBffResponse<DetailItem>>, [TBffDetailParams]>()
      .mockResolvedValue({
        data: undefined,
        error: true,
        status: 404,
        message: 'missing',
        i18nMessageError: 'detail.response.error',
        i18nMessageSuccess: 'detail.success',
      });

    const { result } = renderHook(() =>
      useDetail<DetailItem, DetailFilters>({
        identifier: 'entity-1',
        fetchDetail,
        initialFilters: { name: '', status: '' },
        initialInputFilters,
        fetchErrorMessage: 'detail.fetch.error',
      }),
    );

    act(() => {
      jest.runOnlyPendingTimers();
    });

    await waitFor(() => {
      expect(result.current.errorMessage).toBe('translated:detail.fetch.error');
      expect(showAlert).toHaveBeenCalledWith({
        type: 'error',
        message: undefined,
      });
    });
  });

  it('uses the thrown Error message when the request fails', async () => {
    const fetchDetail = jest.fn<Promise<TBffResponse<DetailItem>>, [TBffDetailParams]>()
      .mockRejectedValue(new Error('detail failed'));

    const { result } = renderHook(() =>
      useDetail<DetailItem, DetailFilters>({
        identifier: 'entity-1',
        fetchDetail,
        initialFilters: { name: '', status: '' },
        initialInputFilters,
        fetchErrorMessage: 'detail.fetch.error',
      }),
    );

    act(() => {
      jest.runOnlyPendingTimers();
    });

    await waitFor(() => {
      expect(result.current.errorMessage).toBe('detail failed');
      expect(showAlert).toHaveBeenCalledWith({
        type: 'error',
        message: 'detail failed',
      });
      expect(result.current.isLoading).toBe(false);
    });
  });

  it('falls back to the default fetch error message when the request fails with a non-Error', async () => {
    const fetchDetail = jest.fn<Promise<TBffResponse<DetailItem>>, [TBffDetailParams]>()
      .mockRejectedValue('unexpected');

    const { result } = renderHook(() =>
      useDetail<DetailItem, Record<string, string>>({
        identifier: 'entity-1',
        fetchDetail,
      }),
    );

    act(() => {
      jest.runOnlyPendingTimers();
    });

    await waitFor(() => {
      expect(result.current.errorMessage).toBe('translated:common.unknow');
      expect(showAlert).toHaveBeenCalledWith({
        type: 'error',
        message: 'translated:common.unknow',
      });
    });
  });

  it('ignores stale success responses', async () => {
    const staleSuccess = createDeferred<TBffResponse<DetailItem>>();
    const fetchDetail = jest.fn<Promise<TBffResponse<DetailItem>>, [TBffDetailParams]>()
      .mockImplementationOnce(() => staleSuccess.promise)
      .mockResolvedValue({
        data: { id: 'fresh', name: 'Fresh Entity' },
        error: false,
        status: 200,
        message: 'ok',
        i18nMessageError: 'detail.error',
        i18nMessageSuccess: 'detail.success',
      });

    const { result } = renderHook(() =>
      useDetail<DetailItem, DetailFilters>({
        identifier: 'entity-1',
        fetchDetail,
        initialFilters: { name: '', status: '' },
        initialInputFilters,
        fetchErrorMessage: 'detail.fetch.error',
      }),
    );

    act(() => {
      jest.runOnlyPendingTimers();
    });

    await act(async () => {
      result.current.applyFilters?.({ name: 'first', status: 'one' });
    });

    staleSuccess.resolve({
      data: { id: 'stale', name: 'Stale Entity' },
      error: false,
      status: 200,
      message: 'ok',
      i18nMessageError: 'detail.error',
      i18nMessageSuccess: 'detail.success',
    });

    await waitFor(() => {
      expect(result.current.data).toEqual({ id: 'fresh', name: 'Fresh Entity' });
    });

    expect(result.current.errorMessage).toBeUndefined();
  });

  it('ignores stale failure responses', async () => {
    const staleFailure = createDeferred<TBffResponse<DetailItem>>();
    const fetchDetail = jest.fn<Promise<TBffResponse<DetailItem>>, [TBffDetailParams]>()
      .mockImplementationOnce(() => staleFailure.promise)
      .mockResolvedValue({
        data: { id: 'fresh', name: 'Fresh Entity' },
        error: false,
        status: 200,
        message: 'ok',
        i18nMessageError: 'detail.error',
        i18nMessageSuccess: 'detail.success',
      });

    const { result } = renderHook(() =>
      useDetail<DetailItem, DetailFilters>({
        identifier: 'entity-1',
        fetchDetail,
        initialFilters: { name: '', status: '' },
        initialInputFilters,
        fetchErrorMessage: 'detail.fetch.error',
      }),
    );

    act(() => {
      jest.runOnlyPendingTimers();
    });

    await act(async () => {
      result.current.applyFilters?.({ name: 'second', status: 'two' });
    });

    await waitFor(() => {
      expect(result.current.data).toEqual({ id: 'fresh', name: 'Fresh Entity' });
    });

    staleFailure.reject(new Error('stale failure'));

    await waitFor(() => {
      expect(result.current.data).toEqual({ id: 'fresh', name: 'Fresh Entity' });
      expect(result.current.errorMessage).toBeUndefined();
    });
  });
});
