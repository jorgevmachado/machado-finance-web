import React from 'react';

import { fireEvent, render, screen } from '@testing-library/react';

const mockUsePaginatedList = jest.fn();
const mockShowAlert = jest.fn();
const mockOpenModal = jest.fn();
const mockCloseModal = jest.fn();
const mockReload = jest.fn();
const mockClearInputFilters = jest.fn();
const mockApplyInputFilters = jest.fn();
const mockGoToPage = jest.fn();
const mockListPaginate = jest.fn();
const mockDelete = jest.fn();
const mockNormalizeFilters = jest.fn((value: unknown) => value);

jest.mock('@/app/ui', () => ({
  usePaginatedList: (...args: Array<unknown>) => mockUsePaginatedList(...args),
  DeleteEntity: ({
    identifier,
  }: {
    identifier: string;
  }) => <div data-testid="delete-entity" data-identifier={identifier} />,
}));

jest.mock('@/app/ds', () => ({
  Table: jest.fn(
    (props: {
      items: Array<{ id: string; name: string; type: string }>;
      actions: {
        show: { onClick: (item: unknown) => void };
        edit: { onClick: (item: unknown) => void };
        delete: { onClick: (item: unknown) => void };
      };
    }) => (
      <div>
        <button onClick={() => props.actions.show.onClick(props.items[0])}>
          table-show
        </button>
        <button onClick={() => props.actions.edit.onClick(props.items[0])}>
          table-edit
        </button>
        <button onClick={() => props.actions.delete.onClick(props.items[0])}>
          table-delete
        </button>
      </div>
    ),
  ),
  useAlert: () => ({
    showAlert: (...args: Array<unknown>) => mockShowAlert(...args),
  }),
  useModal: () => ({
    openModal: (...args: Array<unknown>) => mockOpenModal(...args),
    closeModal: (...args: Array<unknown>) => mockCloseModal(...args),
    modal: <div data-testid="modal-slot" />,
  }),
}));

jest.mock('@/app/shared', () => ({
  useAppTranslation: () => ({
    t: (key: string) => key,
  }),
}));

jest.mock('@/app/modules/finance', () => ({
  categoryBusiness: {
    INITIAL_FILTERS: { name: undefined, type: undefined },
    INITIAL_INPUT_FILTERS: [],
    normalizeFilters: (...args: Array<unknown>) => mockNormalizeFilters(...args),
    getResponseMessage: () => 'category.success.create',
    getOriginalCategory: (
      items: Array<{ id: string }>,
      tableItem: { id?: string },
    ) => items.find((item) => item.id === tableItem?.id),
  },
  financeBffService: {
    category: {
      list_paginate: (...args: Array<unknown>) => mockListPaginate(...args),
      delete: (...args: Array<unknown>) => mockDelete(...args),
    },
  },
}));

jest.mock('../../components', () => ({
  PersistCategory: ({
    disabled,
    category,
    onClose,
  }: {
    disabled?: boolean;
    category?: { id?: string };
    onClose: (state: { status: string; type: string; message: string }) => void;
  }) => (
    <div
      data-testid="persist-category"
      data-disabled={String(disabled)}
      data-category-id={category?.id ?? ''}
      onClick={() =>
        onClose({
          status: 'success',
          type: 'create',
          message: 'ok',
        })
      }
    />
  ),
}));

jest.mock('../../../../../ui/paginated-list/PaginatedList', () => {
  // eslint-disable-next-line react/display-name
  return ({
    action,
    children,
  }: {
    action: { label: string; onClick: () => void };
    children: React.ReactNode;
  }) => (
    <div>
      <button onClick={action.onClick}>{action.label}</button>
      {children}
    </div>
  );
});

import { Table } from '@/app/ds';

import CategoryListPage from './CategoryListPage';

describe('CategoryListPage', () => {
  const baseItems = [
    {
      id: '1',
      name: 'Food',
      type: 'FOOD',
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    mockUsePaginatedList.mockReturnValue({
      meta: { current_page: 1, total: 1, total_pages: 1, limit: 12, offset: 0 },
      items: baseItems,
      goToPage: mockGoToPage,
      reload: mockReload,
      isLoading: false,
      inputFilters: [],
      clearInputFilters: mockClearInputFilters,
      applyInputFilters: mockApplyInputFilters,
    });
  });

  it('wires usePaginatedList and maps category type for table rendering', () => {
    render(<CategoryListPage />);

    expect(mockUsePaginatedList).toHaveBeenCalledWith(
      expect.objectContaining({
        initialFilters: { name: undefined, type: undefined },
        initialInputFilters: [],
        normalizeFilters: expect.any(Function),
        fetchPaginatedList: expect.any(Function),
      }),
    );

    const tableMock = Table as unknown as jest.Mock;
    const tableProps = tableMock.mock.calls[0][0] as {
      items: Array<{ type: string }>;
    };

    expect(tableProps.items[0].type).toBe('category.types.FOOD');
  });

  it('opens create modal from paginated action', () => {
    render(<CategoryListPage />);

    fireEvent.click(screen.getByRole('button', { name: 'form.create' }));

    expect(mockOpenModal).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'category.create.title',
        body: expect.any(Object),
      }),
    );
  });

  it('handles cancel close state only closing modal', () => {
    render(<CategoryListPage />);
    fireEvent.click(screen.getByRole('button', { name: 'form.create' }));

    const modalBody = mockOpenModal.mock.calls[0][0].body as React.ReactElement<{
      onClose: (state: { status: string; type: string; message: string }) => void;
    }>;

    modalBody.props.onClose({
      status: 'cancel',
      type: 'other',
      message: '',
    });

    expect(mockShowAlert).not.toHaveBeenCalled();
    expect(mockClearInputFilters).not.toHaveBeenCalled();
    expect(mockReload).not.toHaveBeenCalled();
    expect(mockCloseModal).toHaveBeenCalled();
  });

  it('handles success close state showing alert and reloading', () => {
    render(<CategoryListPage />);
    fireEvent.click(screen.getByRole('button', { name: 'form.create' }));

    const modalBody = mockOpenModal.mock.calls[0][0].body as React.ReactElement<{
      onClose: (state: { status: string; type: string; message: string }) => void;
    }>;

    modalBody.props.onClose({
      status: 'success',
      type: 'create',
      message: 'ok',
    });

    expect(mockShowAlert).toHaveBeenCalledWith({
      type: 'success',
      message: 'category.success.create',
    });
    expect(mockClearInputFilters).toHaveBeenCalled();
    expect(mockReload).toHaveBeenCalled();
    expect(mockCloseModal).toHaveBeenCalled();
  });

  it('handles error close state showing error alert', () => {
    render(<CategoryListPage />);
    fireEvent.click(screen.getByRole('button', { name: 'form.create' }));

    const modalBody = mockOpenModal.mock.calls[0][0].body as React.ReactElement<{
      onClose: (state: { status: string; type: string; message: string }) => void;
    }>;

    modalBody.props.onClose({
      status: 'error',
      type: 'update',
      message: 'fail',
    });

    expect(mockShowAlert).toHaveBeenCalledWith({
      type: 'error',
      message: 'category.success.create',
    });
    expect(mockClearInputFilters).toHaveBeenCalled();
    expect(mockReload).toHaveBeenCalled();
    expect(mockCloseModal).toHaveBeenCalled();
  });

  it('opens show, edit and delete modals from table actions', () => {
    render(<CategoryListPage />);

    fireEvent.click(screen.getByRole('button', { name: 'table-show' }));
    fireEvent.click(screen.getByRole('button', { name: 'table-edit' }));
    fireEvent.click(screen.getByRole('button', { name: 'table-delete' }));

    expect(mockOpenModal).toHaveBeenCalledTimes(3);
    expect(mockOpenModal.mock.calls[0][0].title).toBe('category.edit.title');
    expect(mockOpenModal.mock.calls[1][0].title).toBe('category.edit.title');
    expect(mockOpenModal.mock.calls[2][0].title).toBe('category.delete.title');
  });

  it('opens create modal when items are undefined', () => {
    mockUsePaginatedList.mockReturnValue({
      meta: { current_page: 1, total: 0, total_pages: 1, limit: 12, offset: 0 },
      items: undefined,
      goToPage: mockGoToPage,
      reload: mockReload,
      isLoading: false,
      inputFilters: [],
      clearInputFilters: mockClearInputFilters,
      applyInputFilters: mockApplyInputFilters,
    });

    render(<CategoryListPage />);
    fireEvent.click(screen.getByRole('button', { name: 'form.create' }));

    expect(mockOpenModal).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'category.create.title',
      }),
    );
  });
});
