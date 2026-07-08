import { fireEvent, render, screen } from '@testing-library/react';

import Header from './Header';
import type { TableHeaderItem } from './types';

describe('Header.tsx', () => {
  const mockHandleSort = jest.fn();

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

  beforeEach(() => {
    mockHandleSort.mockClear();
  });

  it('renders all headers', () => {
    const sortedColumn = { sort: '', order: '' };
    render(
      <table>
        <Header
          headers={headers}
          handleSort={mockHandleSort}
          sortedColumn={sortedColumn}
        />
      </table>
    );

    expect(screen.getByText('ID')).toBeInTheDocument();
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Email')).toBeInTheDocument();
  });

  it('renders actions header when provided', () => {
    const sortedColumn = { sort: '', order: '' };
    const actions = {
      text: 'Operations',
      uppercase: true,
      align: 'right' as const,
    };

    render(
      <table>
        <Header
          headers={headers}
          actions={actions}
          handleSort={mockHandleSort}
          sortedColumn={sortedColumn}
        />
      </table>
    );

    expect(screen.getByText('Operations')).toBeInTheDocument();
  });

  it('calls handleSort for sortable header click', () => {
    const sortedColumn = { sort: '', order: '' };
    render(
      <table>
        <Header
          headers={headers}
          handleSort={mockHandleSort}
          sortedColumn={sortedColumn}
        />
      </table>
    );

    const idButton = screen.getByRole('button', { name: /^ID/ });
    fireEvent.click(idButton);

    expect(mockHandleSort).toHaveBeenCalledWith(headers[0]);
  });

  it('does not call handleSort for non-sortable header click', () => {
    const sortedColumn = { sort: '', order: '' };
    render(
      <table>
        <Header
          headers={headers}
          handleSort={mockHandleSort}
          sortedColumn={sortedColumn}
        />
      </table>
    );

    const emailButton = screen.getByRole('button', { name: /^Email/ });
    fireEvent.click(emailButton);

    expect(mockHandleSort).not.toHaveBeenCalled();
  });

  it('renders asc icon style for sorted asc column', () => {
    const sortedColumn = { sort: 'name', order: 'asc' };
    const { container } = render(
      <table>
        <Header
          headers={headers}
          handleSort={mockHandleSort}
          sortedColumn={sortedColumn}
        />
      </table>
    );

    const button = screen.getByRole('button', { name: /^Name/ });
    const svg = button.querySelector('svg');
    expect(svg).toHaveClass('text-slate-600');
    expect(container.querySelectorAll('svg')).toHaveLength(2);
  });

  it('renders desc icon style for sorted desc column', () => {
    const sortedColumn = { sort: 'id', order: 'desc' };
    render(
      <table>
        <Header
          headers={headers}
          handleSort={mockHandleSort}
          sortedColumn={sortedColumn}
        />
      </table>
    );

    const button = screen.getByRole('button', { name: /^ID/ });
    const svg = button.querySelector('svg');
    expect(svg).toHaveClass('text-slate-600');
  });

  it('renders unfold icon style for unsorted column', () => {
    const sortedColumn = { sort: '', order: '' };
    render(
      <table>
        <Header
          headers={headers}
          handleSort={mockHandleSort}
          sortedColumn={sortedColumn}
        />
      </table>
    );

    const button = screen.getByRole('button', { name: /^ID/ });
    const svg = button.querySelector('svg');
    expect(svg).toHaveClass('text-slate-400');
  });

  it('applies uppercase class for uppercase header labels', () => {
    const sortedColumn = { sort: '', order: '' };
    render(
      <table>
        <Header
          headers={headers}
          handleSort={mockHandleSort}
          sortedColumn={sortedColumn}
        />
      </table>
    );

    const button = screen.getByRole('button', { name: /^ID/ });
    expect(button).toHaveClass('uppercase');
  });

  it('renders accessible columnheader attributes', () => {
    const sortedColumn = { sort: '', order: '' };
    const { container } = render(
      <table>
        <Header
          headers={headers}
          handleSort={mockHandleSort}
          sortedColumn={sortedColumn}
        />
      </table>
    );

    const columnHeaders = container.querySelectorAll('[role="columnheader"]');
    expect(columnHeaders.length).toBeGreaterThan(0);

    columnHeaders.forEach((header) => {
      expect(header).toHaveAttribute('scope', 'col');
    });
  });

  it('applies style and align from header item', () => {
    const headersWithStyle: TableHeaderItem[] = [
      {
        label: 'ID',
        value: 'id',
        sortable: true,
        style: { width: '100px' },
        align: 'right',
      },
    ];

    const sortedColumn = { sort: '', order: '' };
    const { container } = render(
      <table>
        <Header
          headers={headersWithStyle}
          handleSort={mockHandleSort}
          sortedColumn={sortedColumn}
        />
      </table>
    );

    const th = container.querySelector('th');
    expect(th).toHaveStyle({ width: '100px' });
    expect(th).toHaveAttribute('align', 'right');
  });
});
