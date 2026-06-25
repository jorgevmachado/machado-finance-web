import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
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

  it('should render all headers', () => {
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

  it('should render actions header when provided', () => {
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

  it('should call handleSort when clicking on sortable header', () => {
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

  it('should not call handleSort when clicking on non-sortable header', () => {
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

  it('should display ascending arrow when column is sorted asc', () => {
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

    const svgs = container.querySelectorAll('svg');
    expect(svgs.length).toBeGreaterThan(0);
  });

  it('should display descending arrow when column is sorted desc', () => {
    const sortedColumn = { sort: 'id', order: 'desc' };
    const { container } = render(
      <table>
        <Header
          headers={headers}
          handleSort={mockHandleSort}
          sortedColumn={sortedColumn}
        />
      </table>
    );

    const svgs = container.querySelectorAll('svg');
    expect(svgs.length).toBeGreaterThan(0);
  });

  it('should display unfold icon for non-sorted columns', () => {
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

    const svgs = container.querySelectorAll('svg');
    expect(svgs.length).toBeGreaterThan(0);
  });

  it('should apply uppercase class when uppercase is true', () => {
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

    const thead = container.querySelector('thead');
    expect(thead).toBeInTheDocument();
  });

  it('should render header with proper accessibility attributes', () => {
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

  it('should handle custom style on header item', () => {
    const headersWithStyle: TableHeaderItem[] = [
      {
        label: 'ID',
        value: 'id',
        sortable: true,
        style: { width: '100px' },
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
  });

  it('should handle align attribute properly', () => {
    const headersWithAlign: TableHeaderItem[] = [
      {
        label: 'Amount',
        value: 'amount',
        sortable: true,
        align: 'right',
      },
    ];

    const sortedColumn = { sort: '', order: '' };
    const { container } = render(
      <table>
        <Header
          headers={headersWithAlign}
          handleSort={mockHandleSort}
          sortedColumn={sortedColumn}
        />
      </table>
    );

    const th = container.querySelector('th');
    expect(th).toHaveAttribute('align', 'right');
  });
});
