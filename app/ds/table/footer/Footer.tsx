import type { TableHeaderItem } from '../header';
import { tableBusiness } from '@/app/ds/table/business';

type FooterProps = {
  headers: Array<TableHeaderItem>;
  formattedDate?: boolean
}
export default function Footer({ headers, formattedDate }: FooterProps) {
  return (
    <tfoot className="bg-slate-50">
      <tr>
        {headers.map((header, index) => (
          <td
            key={`table-footer-${index}`}
            role="columnheader"
            scope="col"
            align={header.align ?? 'left'}
            style={header.style}
            aria-label={`footer-header-${header.label}`}
            className="px-4 py-3 text-xs font-semibold tracking-wide text-slate-600"
          >
            {tableBusiness.renderDataItem(header.footer, header.type, formattedDate)}
          </td>
        ))}
      </tr>

    </tfoot>
  );
}