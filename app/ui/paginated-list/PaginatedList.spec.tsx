import { fireEvent, render, screen } from '@testing-library/react';
import type { ElementType, ReactNode } from 'react';

const filtersApplyPayload = { name: 'Jorge' };

jest.mock('@/app/shared', () => ({
  useAppTranslation: () => ({
    t: (key: string, options?: { count?: number }) => {
      if (key === 'pagination.recordCount') return `Records: ${options?.count ?? 0}`;
      if (key === 'account.list.empty') return 'No records';
      if (key === 'account.list.filtersAria') return 'Account filters';
      return key;
    },
  }),
}));

jest.mock('@/app/ds', () => ({
  Badge: ({ children }: { children: ReactNode }) => <span>{children}</span>,
  Button: ({
    children,
    onClick,
  }: {
    children: ReactNode;
    onClick?: () => void;
  }) => (
    <button type='button' onClick={onClick}>
      {children}
    </button>
  ),
  Card: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  Text: ({
    as,
    children,
  }: {
    as?: ElementType;
    children: ReactNode;
  }) => {
    const Tag = (as ?? 'span') as ElementType;
    return <Tag>{children}</Tag>;
  },
  Filters: ({
    ariaLabel,
    onApply,
    onClear,
  }: {
    ariaLabel?: string;
    onApply: (filters: Record<string, string>) => void;
    onClear?: () => void;
  }) => (
    <div>
      <span>{ariaLabel}</span>
      <button type='button' onClick={() => onApply(filtersApplyPayload)}>apply filters</button>
      <button type='button' onClick={() => onClear?.()}>clear filters</button>
    </div>
  ),
  Pagination: ({
    onPageChange,
  }: {
    onPageChange?: (page: number) => void;
  }) => (
    <button type='button' onClick={() => onPageChange?.(2)}>
      go page 2
    </button>
  ),
}));

import PaginatedList from './PaginatedList';

describe('PaginatedList', () => {
  const meta = {
    total: 3,
    limit: 10,
    offset: 0,
    next_page: undefined,
    previous_page: undefined,
    total_pages: 4,
    current_page: 1,
  };

  it('renders title, subtitle, record count and action callback', () => {
    const actionOnClick = jest.fn();
    const goToPage = jest.fn();

    render(
      <PaginatedList
        domain='account'
        title='Accounts'
        subtitle='Manage accounts'
        meta={meta}
        action={{ label: 'Create', onClick: actionOnClick }}
        goToPage={goToPage}
      >
        <div>rows</div>
      </PaginatedList>,
    );

    expect(screen.getByRole('heading', { name: 'Accounts' })).toBeInTheDocument();
    expect(screen.getByText('Manage accounts')).toBeInTheDocument();
    expect(screen.getByText('Records: 3')).toBeInTheDocument();
    expect(screen.getByText('rows')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Create' }));
    expect(actionOnClick).toHaveBeenCalledWith({});

    fireEvent.click(screen.getByRole('button', { name: 'go page 2' }));
    expect(goToPage).toHaveBeenCalledWith(2);
  });

  it('renders empty state when not loading and totalItems is zero', () => {
    render(
      <PaginatedList
        domain='account'
        meta={meta}
        isLoading={false}
        totalItems={0}
      />,
    );

    expect(screen.getByText('No records')).toBeInTheDocument();
  });

  it('does not render empty state while loading', () => {
    render(
      <PaginatedList
        domain='account'
        meta={meta}
        isLoading
        totalItems={0}
      />,
    );

    expect(screen.queryByText('No records')).not.toBeInTheDocument();
  });

  it('renders filters and triggers apply/clear handlers', () => {
    const applyInputFilters = jest.fn();
    const clearInputFilters = jest.fn();

    render(
      <PaginatedList
        domain='account'
        meta={meta}
        inputFilters={[
          {
            name: 'name',
            label: 'Name',
            type: 'text',
            value: '',
            placeholder: 'Name',
          },
        ]}
        applyInputFilters={applyInputFilters}
        clearInputFilters={clearInputFilters}
      />,
    );

    expect(screen.getByText('Account filters')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'apply filters' }));
    expect(applyInputFilters).toHaveBeenCalledWith(filtersApplyPayload);

    fireEvent.click(screen.getByRole('button', { name: 'clear filters' }));
    expect(clearInputFilters).toHaveBeenCalledTimes(1);
  });
});
