import { fireEvent, render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';

const showAlert = jest.fn();
const openModal = jest.fn();
const closeModal = jest.fn();
const clearInputFilters = jest.fn();
const reload = jest.fn();
const goToPage = jest.fn();
const applyInputFilters = jest.fn();
const getResponseMessage = jest.fn(() => 'account.success.create');
const getOriginalAccount = jest.fn((items: Array<{ id: string; name: string }>, item: unknown) =>
  (item ? items[0] : undefined));

jest.mock('@/app/shared', () => ({
  ...jest.requireActual('@/app/shared'),
  useAppTranslation: () => ({
    t: (key: string, options?: { name?: string }) => {
      if (key === 'category.edit.title') return `edit:${options?.name}`;
      return key;
    },
  }),
}));

jest.mock('@/app/modules/finance', () => ({
  financeBffService: {
    account: {
      list_paginate: jest.fn(),
    },
  },
}));

jest.mock('@/app/ds', () => ({
  useAlert: () => ({ showAlert }),
  useModal: () => ({
    openModal,
    closeModal,
    modal: <div data-testid='modal-slot'>modal-slot</div>,
  }),
}));

jest.mock('@/app/ui', () => ({
  PaginatedList: ({
    action,
    children,
  }: {
    action?: { label: string; onClick: (item: unknown) => void };
    children?: ReactNode;
  }) => (
    <div>
      <button type='button' onClick={() => action?.onClick(undefined)}>
        {action?.label}
      </button>
      {children}
    </div>
  ),
  usePaginatedList: () => ({
    meta: { total: 1, total_pages: 1, current_page: 1 },
    items: [
      {
        id: 'acc-1',
        name: 'Main',
      },
    ],
    goToPage,
    reload,
    isLoading: false,
    inputFilters: [],
    clearInputFilters,
    applyInputFilters,
  }),
}));

jest.mock('../../business', () => ({
  accountBusiness: {
    INITIAL_FILTERS: {},
    INITIAL_INPUT_FILTERS: [],
    normalizeFilters: (nextFilters: unknown) => nextFilters,
    getResponseMessage: (...args: Array<unknown>) => getResponseMessage(...args),
    getOriginalAccount: (...args: Array<unknown>) => getOriginalAccount(...args as [Array<{ id: string; name: string }>, unknown]),
  },
}));

jest.mock('../../components', () => ({
  PersistAccount: ({ onClose }: { onClose: (state: unknown) => void }) => (
    <button type='button' onClick={() => onClose({ status: 'success', type: 'create', message: '' })}>
      persist-account
    </button>
  ),
}));

import AccountListPage from './AccountListPage';

describe('AccountListPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('opens create modal from action and renders modal slot', () => {
    render(<AccountListPage />);

    expect(screen.getByTestId('modal-slot')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Account' })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'form.create' }));

    expect(openModal).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'account.create.title',
        body: expect.any(Object),
      }),
    );
  });

  it('handles success close by alerting, clearing filters, reloading and closing modal', () => {
    render(<AccountListPage />);
    fireEvent.click(screen.getByRole('button', { name: 'form.create' }));

    const [{ body }] = openModal.mock.calls[0] as Array<{ body: { props: { onClose: (state: unknown) => void } } }>;
    body.props.onClose({
      status: 'success',
      type: 'create',
      message: '',
    });

    expect(getResponseMessage).toHaveBeenCalled();
    expect(showAlert).toHaveBeenCalledWith({
      type: 'success',
      message: 'account.success.create',
    });
    expect(clearInputFilters).toHaveBeenCalledTimes(1);
    expect(reload).toHaveBeenCalledTimes(1);
    expect(closeModal).toHaveBeenCalledTimes(1);
  });

  it('handles cancel close by only closing modal', () => {
    render(<AccountListPage />);
    fireEvent.click(screen.getByRole('button', { name: 'form.create' }));

    const [{ body }] = openModal.mock.calls[0] as Array<{ body: { props: { onClose: (state: unknown) => void } } }>;
    body.props.onClose({
      status: 'cancel',
      type: 'other',
      message: '',
    });

    expect(showAlert).not.toHaveBeenCalled();
    expect(clearInputFilters).not.toHaveBeenCalled();
    expect(reload).not.toHaveBeenCalled();
    expect(closeModal).toHaveBeenCalledTimes(1);
  });

  it('handles error close with error alert', () => {
    render(<AccountListPage />);
    fireEvent.click(screen.getByRole('button', { name: 'form.create' }));

    const [{ body }] = openModal.mock.calls[0] as Array<{ body: { props: { onClose: (state: unknown) => void } } }>;
    body.props.onClose({
      status: 'error',
      type: 'update',
      message: '',
    });

    expect(showAlert).toHaveBeenCalledWith({
      type: 'error',
      message: 'account.success.create',
    });
  });

  it('opens edit title when original account exists', () => {
    getOriginalAccount.mockReturnValueOnce({
      id: 'acc-1',
      name: 'Main',
    });

    render(<AccountListPage />);
    fireEvent.click(screen.getByRole('button', { name: 'form.create' }));

    expect(openModal).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'edit:Main',
      }),
    );
  });
});
