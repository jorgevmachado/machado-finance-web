import { act, renderHook, waitFor } from '@testing-library/react';

const startContentLoading = jest.fn();
const stopContentLoading = jest.fn();
const translate = jest.fn((key?: string) => (key ? `translated:${key}` : undefined));
const createDeferred = <T,>() => {
  let resolve!: (value: T) => void;
  let reject!: (error: unknown) => void;
  const promise = new Promise<T>((resolvePromise, rejectPromise) => {
    resolve = resolvePromise;
    reject = rejectPromise;
  });

  return { promise, resolve, reject };
};

jest.mock('@/app/shared', () => ({
  useAppTranslation: () => ({
    t: translate,
  }),
}));

jest.mock('@/app/ds', () => ({
  useLoading: () => ({
    startContentLoading,
    stopContentLoading,
  }),
  clampPage: (page: number, totalPages: number) => {
    if (totalPages < 1) return 1;
    return Math.min(Math.max(page, 1), totalPages);
  },
  useFilter: ({
    fetchRequest,
    initialFilters,
    normalizeFilters,
    initialInputFilters,
  }: {
    fetchRequest: (filters: Filters) => void;
    initialFilters: Filters;
    normalizeFilters?: (nextFilters: Filters) => Filters;
    initialInputFilters: Array<{
      name: string;
      label: string;
      type: 'text' | 'autocomplete' | 'select' | 'date' | 'number';
      value: string | number;
      placeholder: string;
    }>;
  }) => {
    const React = require('react') as typeof import('react');

    const [filters, setFilters] = React.useState<Filters>(initialFilters);
    const [inputFilterValues, setInputFilterValues] = React.useState<Record<string, string | number>>(() => (
      Object.fromEntries(initialInputFilters.map((filter) => [filter.name, filter.value ?? '']))
    ));

    const inputFilters = React.useMemo(() => {
      return initialInputFilters.map((filter) => ({
        ...filter,
        value: inputFilterValues[filter.name] ?? '',
      }));
    }, [initialInputFilters, inputFilterValues]);

    const applyFilters = (nextFilters: Filters) => {
      const normalizedFilters = normalizeFilters ? normalizeFilters(nextFilters) : nextFilters;
      setFilters(normalizedFilters);
      fetchRequest(normalizedFilters);
    };

    const applyInputFilters = (nextFilters: Filters) => {
      const filterValues = nextFilters as Record<string, string | undefined>;
      setInputFilterValues((previousState) => {
        const nextState = { ...previousState };
        for (const key of Object.keys(nextState)) {
          nextState[key] = filterValues[key] || '';
        }
        return nextState;
      });
      applyFilters(nextFilters);
    };

    const clearFilters = () => {
      setFilters(initialFilters);
      fetchRequest(initialFilters);
    };

    const clearInputFilters = () => {
      setInputFilterValues((previousState) => (
        Object.fromEntries(Object.keys(previousState).map((key) => [key, '']))
      ));
      clearFilters();
    };

    const updateInputFilters = (nextInputFilters: typeof initialInputFilters) => {
      setInputFilterValues(
        Object.fromEntries(nextInputFilters.map((filter) => [filter.name, filter.value ?? '']))
      );
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
}));

import usePaginatedList from './usePaginatedList';

type Item = { id: string };
type Filters = {
  name?: string;
};

describe('usePaginatedList', () => {
  const initialFilters = { name: '' };
  const initialInputFilters = [
    {
      name: 'name',
      label: 'Name',
      type: 'text' as const,
      value: '',
      placeholder: 'Name',
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    translate.mockImplementation((key?: string) => (key ? `translated:${key}` : undefined));
  });

  it('fetches initial page and exposes loaded items/meta', async () => {
    const fetchPaginatedList = jest.fn().mockResolvedValue({
      error: false,
      data: {
        items: [{ id: '1' }],
        meta: {
          total: 1,
          limit: 12,
          offset: 0,
          next_page: undefined,
          previous_page: undefined,
          total_pages: 3,
          current_page: 1,
        },
      },
    });

    const { result } = renderHook(() =>
      usePaginatedList<Item, Filters>({
        initialFilters,
        normalizeFilters: (nextFilters) => nextFilters,
        fetchPaginatedList,
        initialInputFilters,
      }),
    );

    await waitFor(() => {
      expect(fetchPaginatedList).toHaveBeenCalledWith({
        page: 1,
        filters: { name: '' },
        perPage: 12,
      });
      expect(result.current.items).toEqual([{ id: '1' }]);
      expect(result.current.meta.current_page).toBe(1);
      expect(result.current.isLoading).toBe(false);
    });
    expect(startContentLoading).toHaveBeenCalled();
    expect(stopContentLoading).toHaveBeenCalled();
  });

  it('applies input filters, updates filter inputs and requests page 1', async () => {
    const fetchPaginatedList = jest.fn().mockResolvedValue({
      error: false,
      data: {
        items: [],
        meta: {
          total: 0,
          limit: 12,
          offset: 0,
          next_page: undefined,
          previous_page: undefined,
          total_pages: 1,
          current_page: 1,
        },
      },
    });
    const normalizeFilters = jest.fn((nextFilters: Filters) => ({
      ...nextFilters,
      name: nextFilters.name?.trim(),
    }));

    const { result } = renderHook(() =>
      usePaginatedList<Item, Filters>({
        initialFilters,
        normalizeFilters,
        fetchPaginatedList,
        initialInputFilters,
      }),
    );

    await act(async () => {
      result.current.applyInputFilters({ name: '  Main  ' });
    });

    await waitFor(() => {
      expect(normalizeFilters).toHaveBeenCalledWith({ name: '  Main  ' });
      expect(fetchPaginatedList).toHaveBeenCalledWith({
        page: 1,
        filters: { name: 'Main' },
        perPage: 12,
      });
      expect(result.current.inputFilters[0].value).toBe('  Main  ');
    });
  });

  it('sets translated error message when request throws non-Error', async () => {
    const fetchPaginatedList = jest.fn().mockRejectedValue('network');

    const { result } = renderHook(() =>
      usePaginatedList<Item, Filters>({
        initialFilters,
        normalizeFilters: (nextFilters) => nextFilters,
        fetchPaginatedList,
        initialInputFilters: [],
      }),
    );

    await act(async () => {
      result.current.applyFilters({ name: 'Main' });
    });

    await waitFor(() => {
      expect(result.current.errorMessage).toBe('translated:error.fetchingData');
      expect(result.current.isLoading).toBe(false);
    });
  });

  it('sets translated i18n response error when backend returns error without data', async () => {
    const fetchPaginatedList = jest.fn().mockResolvedValue({
      error: true,
      data: undefined,
      message: '',
      i18nMessageError: 'account.list.error',
    });

    const { result } = renderHook(() =>
      usePaginatedList<Item, Filters>({
        initialFilters,
        normalizeFilters: (nextFilters) => nextFilters,
        fetchPaginatedList,
        initialInputFilters,
      }),
    );

    await waitFor(() => {
      expect(result.current.errorMessage).toBe('translated:account.list.error');
      expect(result.current.isLoading).toBe(false);
    });
  });

  it('falls back to fetchErrorMessage when translated response message is undefined', async () => {
    translate.mockImplementation((key?: string) => (key === 'account.list.error' ? undefined : `translated:${key}`));
    const fetchPaginatedList = jest.fn().mockResolvedValue({
      error: true,
      data: undefined,
      message: '',
      i18nMessageError: 'account.list.error',
    });

    const { result } = renderHook(() =>
      usePaginatedList<Item, Filters>({
        initialFilters,
        normalizeFilters: (nextFilters) => nextFilters,
        fetchPaginatedList,
        initialInputFilters,
        fetchErrorMessage: 'fallback.error',
      }),
    );

    await waitFor(() => {
      expect(result.current.errorMessage).toBe('fallback.error');
    });
  });

  it('ignores stale success result from a previous request', async () => {
    const firstRequest = createDeferred<{
      error: boolean;
      data: {
        items: Array<Item>;
        meta: {
          total: number;
          limit: number;
          offset: number;
          next_page: undefined;
          previous_page: undefined;
          total_pages: number;
          current_page: number;
        };
      };
    }>();
    const fetchPaginatedList = jest.fn()
      .mockImplementationOnce(() => firstRequest.promise)
      .mockResolvedValueOnce({
        error: false,
        data: {
          items: [{ id: 'fresh' }],
          meta: {
            total: 1,
            limit: 12,
            offset: 0,
            next_page: undefined,
            previous_page: undefined,
            total_pages: 3,
            current_page: 2,
          },
        },
      });

    const { result } = renderHook(() =>
      usePaginatedList<Item, Filters>({
        initialFilters,
        normalizeFilters: (nextFilters) => nextFilters,
        fetchPaginatedList,
        initialInputFilters,
      }),
    );

    await waitFor(() => {
      expect(fetchPaginatedList).toHaveBeenCalledTimes(1);
    });

    await act(async () => {
      result.current.applyFilters({ name: 'new' });
    });

    await waitFor(() => {
      expect(result.current.items).toEqual([{ id: 'fresh' }]);
    });

    firstRequest.resolve({
      error: false,
      data: {
        items: [{ id: 'stale' }],
        meta: {
          total: 1,
          limit: 12,
          offset: 0,
          next_page: undefined,
          previous_page: undefined,
          total_pages: 3,
          current_page: 1,
        },
      },
    });

    await waitFor(() => {
      expect(result.current.items).toEqual([{ id: 'fresh' }]);
    });
  });

  it('ignores stale error from a previous request', async () => {
    const firstRequest = createDeferred<{
      error: boolean;
      data: {
        items: Array<Item>;
        meta: {
          total: number;
          limit: number;
          offset: number;
          next_page: undefined;
          previous_page: undefined;
          total_pages: number;
          current_page: number;
        };
      };
    }>();
    const fetchPaginatedList = jest.fn()
      .mockImplementationOnce(() => firstRequest.promise)
      .mockResolvedValueOnce({
        error: false,
        data: {
          items: [{ id: 'ok' }],
          meta: {
            total: 1,
            limit: 12,
            offset: 0,
            next_page: undefined,
            previous_page: undefined,
            total_pages: 3,
            current_page: 2,
          },
        },
      });

    const { result } = renderHook(() =>
      usePaginatedList<Item, Filters>({
        initialFilters,
        normalizeFilters: (nextFilters) => nextFilters,
        fetchPaginatedList,
        initialInputFilters,
      }),
    );

    await act(async () => {
      result.current.applyFilters({ name: 'updated' });
    });

    await waitFor(() => {
      expect(result.current.items).toEqual([{ id: 'ok' }]);
      expect(result.current.errorMessage).toBeUndefined();
    });

    firstRequest.reject(new Error('stale fail'));

    await waitFor(() => {
      expect(result.current.items).toEqual([{ id: 'ok' }]);
      expect(result.current.errorMessage).toBeUndefined();
    });
  });

  it('covers goToPage guards and helper actions', async () => {
    const fetchPaginatedList = jest.fn().mockResolvedValue({
      error: false,
      data: {
        items: [{ id: '1' }],
        meta: {
          total: 1,
          limit: 12,
          offset: 0,
          next_page: undefined,
          previous_page: undefined,
          total_pages: 3,
          current_page: 1,
        },
      },
    });
    const normalizeFilters = jest.fn((nextFilters: Filters) => ({
      ...nextFilters,
      name: nextFilters.name?.trim(),
    }));

    const { result } = renderHook(() =>
      usePaginatedList<Item, Filters>({
        initialFilters,
        normalizeFilters,
        fetchPaginatedList,
        initialInputFilters,
      }),
    );

    await waitFor(() => {
      expect(fetchPaginatedList).toHaveBeenCalledTimes(1);
    });

    act(() => {
      result.current.goToPage(1);
    });

    expect(fetchPaginatedList).toHaveBeenCalledTimes(1);

    act(() => {
      result.current.goToPage(9);
    });

    await waitFor(() => {
      expect(fetchPaginatedList).toHaveBeenCalledWith({
        page: 3,
        filters: { name: '' },
        perPage: 12,
      });
    });

    await act(async () => {
      result.current.applyFilters({ name: '  Main  ' });
    });

    await waitFor(() => {
      expect(result.current.filters).toEqual({ name: 'Main' });
    });

    act(() => {
      result.current.reload();
    });

    await waitFor(() => {
      expect(fetchPaginatedList).toHaveBeenCalledWith({
        page: 1,
        filters: { name: 'Main' },
        perPage: 12,
      });
    });

    act(() => {
      result.current.clearFilters();
    });

    await waitFor(() => {
      expect(fetchPaginatedList).toHaveBeenCalledWith({
        page: 1,
        filters: { name: '' },
        perPage: 12,
      });
    });

    await act(async () => {
      result.current.applyInputFilters({ name: 'abc' });
    });

    await waitFor(() => {
      expect(result.current.inputFilters[0].value).toBe('abc');
    });

    act(() => {
      result.current.clearInputFilters();
    });

    await waitFor(() => {
      expect(result.current.inputFilters[0].value).toBe('');
    });

    act(() => {
      result.current.updateInputFilters([
        {
          name: 'name',
          label: 'Name',
          type: 'text',
          value: 'manual',
          placeholder: 'Name',
        },
      ]);
    });

    expect(result.current.inputFilters[0].value).toBe('manual');
  });

  it('uses Error.message for thrown Error and clears missing input value to empty string', async () => {
    const fetchPaginatedList = jest.fn()
      .mockResolvedValueOnce({
        error: false,
        data: {
          items: [{ id: '1' }],
          meta: {
            total: 1,
            limit: 12,
            offset: 0,
            next_page: undefined,
            previous_page: undefined,
            total_pages: 2,
            current_page: 1,
          },
        },
      })
      .mockRejectedValueOnce(new Error('boom'));

    const { result } = renderHook(() =>
      usePaginatedList<Item, Filters>({
        initialFilters,
        normalizeFilters: (nextFilters) => nextFilters,
        fetchPaginatedList,
        initialInputFilters: [
          ...initialInputFilters,
          {
            name: 'status',
            label: 'Status',
            type: 'text',
            value: 'ACTIVE',
            placeholder: 'Status',
          },
        ],
      }),
    );

    await waitFor(() => {
      expect(result.current.items).toEqual([{ id: '1' }]);
    });

    await act(async () => {
      result.current.applyInputFilters({ name: 'abc' } as Filters);
    });

    expect(result.current.inputFilters.find((filter) => filter.name === 'status')?.value).toBe('');

    await waitFor(() => {
      expect(result.current.errorMessage).toBe('boom');
    });
  });

  it('falls back to empty string for missing inputFilterValues key', async () => {
    const fetchPaginatedList = jest.fn().mockResolvedValue({
      error: false,
      data: {
        items: [],
        meta: {
          total: 0,
          limit: 12,
          offset: 0,
          next_page: undefined,
          previous_page: undefined,
          total_pages: 1,
          current_page: 1,
        },
      },
    });

    const { result } = renderHook(() =>
      usePaginatedList<Item, Filters>({
        initialFilters,
        normalizeFilters: (nextFilters) => nextFilters,
        fetchPaginatedList,
        initialInputFilters: [
          ...initialInputFilters,
          {
            name: 'status',
            label: 'Status',
            type: 'text',
            value: '',
            placeholder: 'Status',
          },
        ],
      }),
    );

    act(() => {
      result.current.updateInputFilters([
        {
          name: 'name',
          label: 'Name',
          type: 'text',
          value: 'only-name',
          placeholder: 'Name',
        },
      ]);
    });

    expect(result.current.inputFilters.find((filter) => filter.name === 'status')?.value).toBe('');
  });
});
