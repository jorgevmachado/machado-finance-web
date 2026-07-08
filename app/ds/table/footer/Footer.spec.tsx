import { render, screen } from '@testing-library/react';

import { ETypeTableHeader } from '../header';
import type { TableHeaderItem } from '../header';
import Footer from './Footer';

describe('Footer.tsx', () => {
  it('renders footer values from header.footer', () => {
    const headers: TableHeaderItem[] = [
      { label: 'Description', value: 'description', sortable: false, footer: 'Total' },
      { label: 'Amount', value: 'amount', sortable: false, type: ETypeTableHeader.MONEY, footer: 3210.45 },
    ];

    render(
      <table>
        <Footer headers={headers} />
      </table>
    );

    expect(screen.getByText('Total')).toBeInTheDocument();
    expect(screen.getByText('R$ 3.210,45')).toBeInTheDocument();
  });

  it('formats date footer values when formattedDate is true', () => {
    const headers: TableHeaderItem[] = [
      {
        label: 'Created At',
        value: 'createdAt',
        sortable: false,
        type: ETypeTableHeader.DATE,
        footer: '2024-01-15',
      },
    ];

    render(
      <table>
        <Footer headers={headers} formattedDate={true} />
      </table>
    );

    expect(screen.getByText((content) => /\d{1,2}\/\d{1,2}\/\d{4}/.test(content))).toBeInTheDocument();
  });

  it('applies accessibility and style attributes for footer cells', () => {
    const headers: TableHeaderItem[] = [
      {
        label: 'Amount',
        value: 'amount',
        sortable: false,
        align: 'right',
        style: { width: '120px' },
        footer: 1000,
      },
    ];

    const { container } = render(
      <table>
        <Footer headers={headers} />
      </table>
    );

    const cell = container.querySelector('tfoot td');
    expect(cell).toHaveAttribute('role', 'columnheader');
    expect(cell).toHaveAttribute('scope', 'col');
    expect(cell).toHaveAttribute('aria-label', 'footer-header-Amount');
    expect(cell).toHaveAttribute('align', 'right');
    expect(cell).toHaveStyle({ width: '120px' });
  });
});
