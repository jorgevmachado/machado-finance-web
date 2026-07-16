import { fireEvent, render, screen } from '@testing-library/react';

import Body from './Body';
import type { TableHeaderItem } from '../header';
import type { TableActions } from './action';
import { ETypeTableHeader } from '../header/enum';

describe('Body.tsx', () => {
  const mockOnRowClick = jest.fn();
  const mockOnCellClick = jest.fn();

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
    mockOnCellClick.mockClear();
  });

  it('renders all rows and cells', () => {
    render(
      <table>
        <Body items={items} headers={headers} />
      </table>
    );

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    expect(screen.getByText('Bob Johnson')).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
  });

  it('supports row click and keyboard interaction', () => {
    const { container } = render(
      <table>
        <Body items={items} headers={headers} onRowClick={mockOnRowClick} />
      </table>
    );

    const rows = container.querySelectorAll('tbody tr');
    fireEvent.click(rows[0]);
    fireEvent.keyDown(rows[1], { key: 'Enter' });
    fireEvent.keyDown(rows[2], { key: ' ', code: 'Space', charCode: 32, keyCode: 32 });
    fireEvent.keyDown(rows[0], { key: 'Escape' });

    expect(rows[0]).toHaveAttribute('role', 'button');
    expect(rows[0]).toHaveAttribute('tabindex', '0');
    expect(rows[0]).toHaveClass('cursor-pointer');
    expect(mockOnRowClick).toHaveBeenCalledWith(items[0]);
    expect(mockOnRowClick).toHaveBeenCalledWith(items[1]);
    expect(mockOnRowClick).toHaveBeenCalledWith(items[2]);
    expect(mockOnRowClick).toHaveBeenCalledTimes(3);
  });

  it('keeps row non-interactive when onRowClick is not provided', () => {
    const { container } = render(
      <table>
        <Body items={items} headers={headers} />
      </table>
    );

    const row = container.querySelector('tbody tr');
    expect(row).not.toHaveAttribute('role');
    expect(row).not.toHaveAttribute('tabindex');
    expect(row).not.toHaveClass('cursor-pointer');
  });

  it('calls onCellClick using nested header root path value', () => {
    const itemsWithNested = [{ id: '1', user: { name: 'John Doe' } }];
    const headersWithNested: TableHeaderItem[] = [
      { label: 'ID', value: 'id', sortable: true },
      { label: 'User Name', value: 'user.name', sortable: true },
    ];

    render(
      <table>
        <Body
          items={itemsWithNested}
          headers={headersWithNested}
          onCellClick={mockOnCellClick}
        />
      </table>
    );

    fireEvent.click(screen.getByText('John Doe'));
    expect(mockOnCellClick).toHaveBeenCalledWith({ name: 'John Doe' });
  });

  it('renders actions and triggers action handlers', () => {
    const mockShowAction = jest.fn();
    const mockEditAction = jest.fn();
    const mockDeleteAction = jest.fn();
    const actions: TableActions = {
      show: { label: 'View', onClick: mockShowAction },
      edit: { label: 'Edit', onClick: mockEditAction },
      delete: { label: 'Delete', onClick: mockDeleteAction },
    };

    render(
      <table>
        <Body items={items} headers={headers} actions={actions} />
      </table>
    );

    fireEvent.click(screen.getAllByRole('button', { name: 'View' })[0]);
    fireEvent.click(screen.getAllByRole('button', { name: 'Edit' })[0]);
    fireEvent.click(screen.getAllByRole('button', { name: 'Delete' })[0]);

    expect(mockShowAction).toHaveBeenCalledWith(items[0]);
    expect(mockEditAction).toHaveBeenCalledWith(items[0]);
    expect(mockDeleteAction).toHaveBeenCalledWith(items[0]);
  });

  it('formats date and money values based on header type', () => {
    const itemsWithFormattedFields = [{ id: '1', createdAt: '2024-01-15', amount: 1234.56 }];
    const headersWithFormat: TableHeaderItem[] = [
      { label: 'ID', value: 'id', sortable: true },
      { label: 'Created At', value: 'createdAt', type: ETypeTableHeader.DATE, sortable: true },
      { label: 'Amount', value: 'amount', type: ETypeTableHeader.MONEY, sortable: true },
    ];

    render(
      <table>
        <Body items={itemsWithFormattedFields} headers={headersWithFormat} formattedDate={true} />
      </table>
    );

    expect(screen.getByText('R$ 1.234,56')).toBeInTheDocument();
    expect(screen.getByText((content) => /\d{1,2}\/\d{1,2}\/\d{4}/.test(content))).toBeInTheDocument();
  });

  it('applies condition color classes when conditionColor is provided', () => {
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

    const cells = container.querySelectorAll('tbody tr td');
    expect(cells[1]).toHaveClass('bg-green-500');
    expect(cells[1]).toHaveClass('text-white');
    expect(cells[3]).toHaveClass('bg-red-500');
    expect(cells[3]).toHaveClass('text-white');
  });

  it('renders React element values in cells', () => {
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

  it('renders empty tbody when items are empty', () => {
    const { container } = render(
      <table>
        <Body items={[]} headers={headers} />
      </table>
    );

    const tbody = container.querySelector('tbody');
    const rows = tbody?.querySelectorAll('tr');

    expect(rows?.length).toBe(0);
  });

  it('applies align from header to table cell', () => {
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
