import { fireEvent, render, screen } from '@testing-library/react';

import Table from './Table';
import { ETypeTableHeader } from './header';
import type { TableHeaderItem } from './header';
import type { TableActions } from './body';

describe('Table.tsx', () => {
  const mockOnRowClick = jest.fn();
  const mockOnChangeOrder = jest.fn();
  const mockOnSortedColumn = jest.fn();
  const mockOnCellClick = jest.fn();

  const headers: TableHeaderItem[] = [
    {
      label: 'ID',
      value: 'id',
      sortable: true,
      uppercase: true,
    },
    {
      label: 'Name',
      value: 'name',
      sortable: true,
    },
    {
      label: 'Email',
      value: 'email',
      sortable: false,
    },
  ];

  const items = [
    { id: '3', name: 'Charlie', email: 'charlie@example.com' },
    { id: '1', name: 'Alice', email: 'alice@example.com' },
    { id: '2', name: 'Bob', email: 'bob@example.com' },
  ];

  beforeEach(() => {
    mockOnRowClick.mockClear();
    mockOnChangeOrder.mockClear();
    mockOnSortedColumn.mockClear();
    mockOnCellClick.mockClear();
  });

  it('renders headers and rows', () => {
    const { container } = render(<Table items={items} headers={headers} />);

    expect(screen.getByText('ID')).toBeInTheDocument();
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Charlie')).toBeInTheDocument();
    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(container.querySelectorAll('tbody tr')).toHaveLength(3);
  });

  it('returns null when empty and not-found is disabled', () => {
    const { container } = render(
      <Table items={[]} headers={headers} showNotFoundError={false} />
    );

    expect(container.firstChild).toBeNull();
  });

  it('shows custom not-found message when empty', () => {
    render(
      <Table
        items={[]}
        headers={headers}
        showNotFoundError={true}
        notFoundMessage="No items found"
      />
    );

    expect(screen.getByText('No items found')).toBeInTheDocument();
  });

  it('shows default not-found message when empty', () => {
    render(
      <Table
        items={[]}
        headers={headers}
        showNotFoundError={true}
      />
    );

    expect(screen.getByText('No data found!!')).toBeInTheDocument();
  });

  it('calls onRowClick on row click and keyboard enter', () => {
    const { container } = render(
      <Table items={items} headers={headers} onRowClick={mockOnRowClick} />
    );

    const rows = container.querySelectorAll('tbody tr');
    fireEvent.click(rows[0]);
    fireEvent.keyDown(rows[1], { key: 'Enter' });

    expect(mockOnRowClick).toHaveBeenCalledWith(items[0]);
    expect(mockOnRowClick).toHaveBeenCalledWith(items[1]);
  });

  it('sorts and emits change callbacks for sortable columns', () => {
    const { container } = render(
      <Table
        items={items}
        headers={headers}
        onChangeOrder={mockOnChangeOrder}
        onSortedColumn={mockOnSortedColumn}
      />
    );

    const buttons = screen.getAllByRole('button');
    const idButton = buttons[0];

    fireEvent.click(idButton);
    let rows = container.querySelectorAll('tbody tr');
    expect(rows[0].textContent).toContain('1');

    fireEvent.click(idButton);
    rows = container.querySelectorAll('tbody tr');
    expect(rows[0].textContent).toContain('3');

    expect(mockOnChangeOrder).toHaveBeenNthCalledWith(1, { sort: 'id', order: 'asc' });
    expect(mockOnChangeOrder).toHaveBeenNthCalledWith(2, { sort: 'id', order: 'desc' });
    expect(mockOnSortedColumn).toHaveBeenNthCalledWith(1, { sort: 'id', order: 'asc' });
    expect(mockOnSortedColumn).toHaveBeenNthCalledWith(2, { sort: 'id', order: 'desc' });
  });

  it('sorts when only onChangeOrder is provided', () => {
    render(
      <Table
        items={items}
        headers={headers}
        onChangeOrder={mockOnChangeOrder}
      />,
    );

    fireEvent.click(screen.getAllByRole('button')[0]);

    expect(mockOnChangeOrder).toHaveBeenCalledWith({ sort: 'id', order: 'asc' });
  });

  it('sorts when only onSortedColumn is provided', () => {
    render(
      <Table
        items={items}
        headers={headers}
        onSortedColumn={mockOnSortedColumn}
      />,
    );

    fireEvent.click(screen.getAllByRole('button')[0]);

    expect(mockOnSortedColumn).toHaveBeenCalledWith({ sort: 'id', order: 'asc' });
  });

  it('ignores click on non-sortable columns', () => {
    render(
      <Table items={items} headers={headers} onChangeOrder={mockOnChangeOrder} />
    );

    const buttons = screen.getAllByRole('button');
    const emailButton = buttons[2];

    fireEvent.click(emailButton);

    expect(mockOnChangeOrder).not.toHaveBeenCalled();
  });

  it('renders row actions and triggers click handlers', () => {
    const mockShowAction = jest.fn();
    const mockEditAction = jest.fn();
    const mockDeleteAction = jest.fn();

    const actions: TableActions = {
      show: {
        label: 'View',
        onClick: mockShowAction,
      },
      edit: {
        label: 'Edit',
        onClick: mockEditAction,
      },
      delete: {
        label: 'Delete',
        onClick: mockDeleteAction,
      },
    };

    render(<Table items={items} headers={headers} actions={actions} />);

    fireEvent.click(screen.getAllByRole('button', { name: 'View' })[0]);
    fireEvent.click(screen.getAllByRole('button', { name: 'Edit' })[0]);
    fireEvent.click(screen.getAllByRole('button', { name: 'Delete' })[0]);

    expect(mockShowAction).toHaveBeenCalledWith(items[0]);
    expect(mockEditAction).toHaveBeenCalledWith(items[0]);
    expect(mockDeleteAction).toHaveBeenCalledWith(items[0]);
  });

  it('handles undefined items with fallback empty list', () => {
    const { container } = render(
      <Table
        items={undefined as unknown as Array<unknown>}
        headers={headers}
        showNotFoundError={false}
      />,
    );

    expect(container.firstChild).toBeNull();
  });

  it('applies initial sortedColumn from props on first render', () => {
    const { container } = render(
      <Table
        items={items}
        headers={headers}
        sortedColumn={{ sort: 'id', order: 'asc' }}
      />
    );

    const rows = container.querySelectorAll('tbody tr');
    expect(rows[0].textContent).toContain('1');
  });

  it('calls onCellClick with nested root object', () => {
    const nestedItems = [{ id: '1', user: { name: 'Alice' } }];
    const nestedHeaders: TableHeaderItem[] = [
      { label: 'ID', value: 'id', sortable: true },
      { label: 'User', value: 'user.name', sortable: true },
    ];

    render(
      <Table
        items={nestedItems}
        headers={nestedHeaders}
        onCellClick={mockOnCellClick}
      />
    );

    fireEvent.click(screen.getByText('Alice'));
    expect(mockOnCellClick).toHaveBeenCalledWith({ name: 'Alice' });
  });

  it('renders footer values when enabled', () => {
    const headersWithFooter: TableHeaderItem[] = [
      { label: 'Name', value: 'name', sortable: true, footer: 'Total' },
      { label: 'Amount', value: 'amount', sortable: true, type: ETypeTableHeader.MONEY, footer: 1234.56 },
      { label: 'Date', value: 'createdAt', sortable: true, type: ETypeTableHeader.DATE, footer: '2024-01-15' },
    ];

    const footerItems = [{ name: 'A', amount: 100, createdAt: '2024-01-10' }];

    render(
      <Table
        items={footerItems}
        headers={headersWithFooter}
        withFooter={true}
        formattedDate={true}
      />
    );

    expect(screen.getByText('Total')).toBeInTheDocument();
    expect(screen.getByText('R$ 1.234,56')).toBeInTheDocument();
    expect(screen.getByText((content) => /\d{1,2}\/\d{1,2}\/\d{4}/.test(content))).toBeInTheDocument();
  });
});
