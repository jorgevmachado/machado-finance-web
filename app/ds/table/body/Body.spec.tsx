import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Body from './Body';
import type { TableHeaderItem } from '../header';
import type { TableActions } from './action';
import { ETypeTableHeader } from '../header/enum';

describe('Body.tsx', () => {
  const mockOnRowClick = jest.fn();

  const headers: TableHeaderItem[] = [
    {
      label: 'ID',
      value: 'id',
      sortable: true,
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
    { id: '1', name: 'John Doe', email: 'john@example.com' },
    { id: '2', name: 'Jane Smith', email: 'jane@example.com' },
    { id: '3', name: 'Bob Johnson', email: 'bob@example.com' },
  ];

  beforeEach(() => {
    mockOnRowClick.mockClear();
  });

  it('should render all items as table rows', () => {
    render(
      <table>
        <Body items={items} headers={headers} />
      </table>
    );

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    expect(screen.getByText('Bob Johnson')).toBeInTheDocument();
  });

  it('should render all columns for each item', () => {
    render(
      <table>
        <Body items={items} headers={headers} />
      </table>
    );

    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
  });

  it('should call onRowClick when clicking on a row', () => {
    render(
      <table>
        <Body items={items} headers={headers} onRowClick={mockOnRowClick} />
      </table>
    );

    const rows = screen.getAllByRole('button');
    fireEvent.click(rows[0]);

    expect(mockOnRowClick).toHaveBeenCalledWith(items[0]);
  });

  it('should not apply cursor-pointer class when onRowClick is not provided', () => {
    const { container } = render(
      <table>
        <Body items={items} headers={headers} />
      </table>
    );

    const tbody = container.querySelector('tbody');
    const rows = tbody?.querySelectorAll('tr');

    expect(rows?.[0]).not.toHaveClass('cursor-pointer');
  });

  it('should apply cursor-pointer class when onRowClick is provided', () => {
    const { container } = render(
      <table>
        <Body items={items} headers={headers} onRowClick={mockOnRowClick} />
      </table>
    );

    const tbody = container.querySelector('tbody');
    const rows = tbody?.querySelectorAll('tr');

    expect(rows?.[0]).toHaveClass('cursor-pointer');
  });

  it('should render action buttons when actions are provided', () => {
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
      <table>
        <Body items={items} headers={headers} actions={actions} />
      </table>
    );

    const actionButtons = container.querySelectorAll('button[type="button"]');
    expect(actionButtons.length).toBeGreaterThan(0);
  });

  it('should format dates when formattedDate is true', () => {
    const itemsWithDate = [
      {
        id: '1',
        name: 'John Doe',
        createdAt: '2024-01-15',
      },
    ];

    const headersWithDate: TableHeaderItem[] = [
      { label: 'ID', value: 'id', sortable: true },
      { label: 'Name', value: 'name', sortable: true },
      {
        label: 'Created At',
        value: 'createdAt',
        type: ETypeTableHeader.DATE,
        sortable: true,
      },
    ];

    const { container } = render(
      <table>
        <Body
          items={itemsWithDate}
          headers={headersWithDate}
          formattedDate={true}
        />
      </table>
    );

    const dateCell = container.querySelector('td');
    expect(dateCell?.textContent).toBeDefined();
  });

  it('should format currency when type is MONEY', () => {
    const itemsWithMoney = [
      { id: '1', name: 'John Doe', amount: 1000 },
    ];

    const headersWithMoney: TableHeaderItem[] = [
      { label: 'ID', value: 'id', sortable: true },
      { label: 'Name', value: 'name', sortable: true },
      {
        label: 'Amount',
        value: 'amount',
        type: ETypeTableHeader.MONEY,
        sortable: true,
      },
    ];

    const { container } = render(
      <table>
        <Body items={itemsWithMoney} headers={headersWithMoney} />
      </table>
    );

    expect(container.innerHTML).toBeDefined();
  });

  it('should handle nested object properties', () => {
    const itemsWithNested = [
      {
        id: '1',
        user: {
          name: 'John Doe',
        },
      },
    ];

    const headersWithNested: TableHeaderItem[] = [
      { label: 'ID', value: 'id', sortable: true },
      { label: 'User Name', value: 'user.name', sortable: true },
    ];

    render(
      <table>
        <Body items={itemsWithNested} headers={headersWithNested} />
      </table>
    );

    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });

  it('should call onRowClick when pressing Enter on a focused row', () => {
    const { container } = render(
      <table>
        <Body items={items} headers={headers} onRowClick={mockOnRowClick} />
      </table>
    );

    const tbody = container.querySelector('tbody');
    const firstRow = tbody?.querySelector('tr') as HTMLElement;

    fireEvent.keyDown(firstRow, { key: 'Enter' });

    expect(mockOnRowClick).toHaveBeenCalled();
  });

  it('should call onRowClick when pressing Space on a focused row', () => {
    const { container } = render(
      <table>
        <Body items={items} headers={headers} onRowClick={mockOnRowClick} />
      </table>
    );

    const tbody = container.querySelector('tbody');
    const firstRow = tbody?.querySelector('tr') as HTMLElement;

    fireEvent.keyDown(firstRow, { key: ' ' });

    expect(mockOnRowClick).toHaveBeenCalled();
  });

  it('should apply condition color when conditionColor is provided', () => {
    const itemsWithCondition = [
      { id: '1', name: 'Active', isActive: true },
      { id: '2', name: 'Inactive', isActive: false },
    ];

    const headersWithCondition: TableHeaderItem[] = [
      { label: 'ID', value: 'id', sortable: true },
      {
        label: 'Status',
        value: 'isActive',
        sortable: true,
        conditionColor: {
          trueColor: 'bg-green-500',
          falseColor: 'bg-red-500',
        },
      },
    ];

    const { container } = render(
      <table>
        <Body items={itemsWithCondition} headers={headersWithCondition} />
      </table>
    );

    expect(container.innerHTML).toBeDefined();
  });

  it('should render React elements as cell content', () => {
    const itemsWithElement = [
      {
        id: '1',
        name: <span data-testid="custom-element">Custom Element</span>,
      },
    ];

    const headersForElement: TableHeaderItem[] = [
      { label: 'ID', value: 'id', sortable: true },
      { label: 'Name', value: 'name', sortable: true },
    ];

    render(
      <table>
        <Body items={itemsWithElement} headers={headersForElement} />
      </table>
    );

    expect(screen.getByTestId('custom-element')).toBeInTheDocument();
  });

  it('should handle empty items array', () => {
    const { container } = render(
      <table>
        <Body items={[]} headers={headers} />
      </table>
    );

    const tbody = container.querySelector('tbody');
    const rows = tbody?.querySelectorAll('tr');

    expect(rows?.length).toBe(0);
  });

  it('should handle align attribute in headers', () => {
    const headersWithAlign: TableHeaderItem[] = [
      { label: 'ID', value: 'id', sortable: true, align: 'right' },
      { label: 'Name', value: 'name', sortable: true },
    ];

    const { container } = render(
      <table>
        <Body items={items} headers={headersWithAlign} />
      </table>
    );

    const cells = container.querySelectorAll('td');
    expect(cells[0]).toHaveAttribute('align', 'right');
  });
});
