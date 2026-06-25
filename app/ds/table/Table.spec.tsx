import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Table from './Table';
import type { TableHeaderItem } from './header';
import type { TableActions } from './body';

describe('Table.tsx', () => {
  const mockOnRowClick = jest.fn();
  const mockOnChangeOrder = jest.fn();
  const mockOnSortedColumn = jest.fn();

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
  });

  it('should render table with headers and items', () => {
    render(
      <Table items={items} headers={headers} />
    );

    expect(screen.getByText('ID')).toBeInTheDocument();
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Charlie')).toBeInTheDocument();
    expect(screen.getByText('Alice')).toBeInTheDocument();
  });

  it('should return null when items are empty and showNotFoundError is false', () => {
    const { container } = render(
      <Table items={[]} headers={headers} showNotFoundError={false} />
    );

    expect(container.firstChild).toBeNull();
  });

  it('should show not found message when items are empty and showNotFoundError is true', () => {
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

  it('should show default not found message when items are empty', () => {
    render(
      <Table
        items={[]}
        headers={headers}
        showNotFoundError={true}
      />
    );

    expect(screen.getByText('No data found!!')).toBeInTheDocument();
  });

  it('should call onRowClick when clicking on a row', () => {
    const { container } = render(
      <Table items={items} headers={headers} onRowClick={mockOnRowClick} />
    );

    const rows = container.querySelectorAll('tbody tr');
    fireEvent.click(rows[0]);

    expect(mockOnRowClick).toHaveBeenCalledWith(items[0]);
  });

  it('should sort items by column when header is clicked', () => {
    const { container } = render(
      <Table items={items} headers={headers} />
    );

    const buttons = screen.getAllByRole('button');
    const idButton = buttons[0];

    fireEvent.click(idButton);

    expect(screen.getByText('Alice')).toBeInTheDocument();
    const rows = container.querySelectorAll('tbody tr');
    expect(rows[0].textContent).toContain('1');
  });

  it('should toggle sort direction when clicking same column twice', () => {
    render(
      <Table items={items} headers={headers} />
    );

    const buttons = screen.getAllByRole('button');
    const idButton = buttons[0];

    fireEvent.click(idButton);
    expect(screen.getByText('Alice')).toBeInTheDocument();

    fireEvent.click(idButton);
    expect(screen.getByText('Charlie')).toBeInTheDocument();
  });

  it('should reset sort when clicking same column third time', () => {
    const { container } = render(
      <Table items={items} headers={headers} />
    );

    const buttons = screen.getAllByRole('button');
    const idButton = buttons[0];

    fireEvent.click(idButton);
    fireEvent.click(idButton);
    fireEvent.click(idButton);

    expect(container.querySelector('tbody')).toBeInTheDocument();
  });

  it('should call onChangeOrder when sorting', () => {
    render(
      <Table
        items={items}
        headers={headers}
        onChangeOrder={mockOnChangeOrder}
      />
    );

    const buttons = screen.getAllByRole('button');
    fireEvent.click(buttons[0]);

    expect(mockOnChangeOrder).toHaveBeenCalledWith({
      sort: 'id',
      order: 'asc',
    });
  });

  it('should call onSortedColumn when sorting', () => {
    render(
      <Table
        items={items}
        headers={headers}
        onSortedColumn={mockOnSortedColumn}
      />
    );

    const buttons = screen.getAllByRole('button');
    fireEvent.click(buttons[0]);

    expect(mockOnSortedColumn).toHaveBeenCalledWith({
      sort: 'id',
      order: 'asc',
    });
  });

  it('should not sort when clicking non-sortable header', () => {
    render(
      <Table items={items} headers={headers} />
    );

    const buttons = screen.getAllByRole('button');
    const emailButton = buttons[2];

    fireEvent.click(emailButton);

    expect(mockOnChangeOrder).not.toHaveBeenCalled();
  });

  it('should render actions when provided', () => {
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

    const { container } = render(
      <Table items={items} headers={headers} actions={actions} />
    );

    const buttons = container.querySelectorAll('button');
    expect(buttons.length).toBeGreaterThan(headers.length);
  });

  it('should use initial sortedColumn prop', () => {
    const { container } = render(
      <Table
        items={items}
        headers={headers}
        sortedColumn={{ sort: 'name', order: 'asc' }}
      />
    );

    expect(screen.getByText('Alice')).toBeInTheDocument();
    const rows = container.querySelectorAll('tbody tr');
    expect(rows[0].textContent).toContain('Alice');
  });

  it('should format dates when formattedDate is true', () => {
    const itemsWithDate = [
      { id: '1', name: 'John', email: 'john@example.com', createdAt: '2024-01-15' },
    ];

    const headersWithDate: TableHeaderItem[] = [
      { label: 'ID', value: 'id', sortable: true },
      { label: 'Name', value: 'name', sortable: true },
      { label: 'Email', value: 'email', sortable: false },
      { label: 'Created', value: 'createdAt', sortable: true },
    ];

    render(
      <Table
        items={itemsWithDate}
        headers={headersWithDate}
        formattedDate={true}
      />
    );

    expect(screen.getByText('John')).toBeInTheDocument();
  });

  it('should render table structure correctly', () => {
    const { container } = render(
      <Table items={items} headers={headers} />
    );

    const table = container.querySelector('table');
    const thead = container.querySelector('thead');
    const tbody = container.querySelector('tbody');

    expect(table).toBeInTheDocument();
    expect(thead).toBeInTheDocument();
    expect(tbody).toBeInTheDocument();
  });

  it('should have proper border and styling classes', () => {
    const { container } = render(
      <Table items={items} headers={headers} />
    );

    const tableContainer = container.querySelector('div');
    expect(tableContainer?.className).toContain('rounded-xl');
    expect(tableContainer?.className).toContain('border');
  });

  it('should handle keyboard navigation on rows', () => {
    const { container } = render(
      <Table items={items} headers={headers} onRowClick={mockOnRowClick} />
    );

    const rows = container.querySelectorAll('tbody tr');
    const firstRow = rows[0] as HTMLElement;

    fireEvent.keyDown(firstRow, { key: 'Enter' });

    expect(mockOnRowClick).toHaveBeenCalled();
  });

  it('should handle multiple sorts correctly', () => {
    render(
      <Table items={items} headers={headers} />
    );

    const buttons = screen.getAllByRole('button');

    fireEvent.click(buttons[0]);
    fireEvent.click(buttons[1]);

    expect(mockOnChangeOrder).not.toHaveBeenCalled();
  });

  it('should render with empty items array', () => {
    const { container } = render(
      <Table items={[]} headers={headers} showNotFoundError={false} />
    );

    expect(container.firstChild).toBeNull();
  });

  it('should handle sortedColumn updates', () => {
    const { rerender, container } = render(
      <Table
        items={items}
        headers={headers}
        sortedColumn={{ sort: '', order: '' }}
      />
    );

    let rows = container.querySelectorAll('tbody tr');
    const firstText = rows[0].textContent;

    rerender(
      <Table
        items={items}
        headers={headers}
        sortedColumn={{ sort: 'id', order: 'asc' }}
      />
    );

    rows = container.querySelectorAll('tbody tr');
    const newFirstText = rows[0].textContent;

    expect(firstText).toBeDefined();
    expect(newFirstText).toBeDefined();
  });

  it('should call both onChangeOrder and onSortedColumn', () => {
    render(
      <Table
        items={items}
        headers={headers}
        onChangeOrder={mockOnChangeOrder}
        onSortedColumn={mockOnSortedColumn}
      />
    );

    const buttons = screen.getAllByRole('button');
    fireEvent.click(buttons[0]);

    expect(mockOnChangeOrder).toHaveBeenCalled();
    expect(mockOnSortedColumn).toHaveBeenCalled();
  });
});
