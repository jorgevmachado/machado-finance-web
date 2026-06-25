import type { SortedColumn } from '../types';
import type { TableActions } from '../body';
import type { TableHeaderItem } from './types';

import { MdArrowDownward ,MdArrowUpward ,MdUnfoldMore } from 'react-icons/md';
import { joinClass } from '@/app/utils';

type HeaderProps = {
  headers: Array<TableHeaderItem>;
  actions?: TableActions
  handleSort: (header: TableHeaderItem) => void;
  sortedColumn: SortedColumn
};
export default function Header({ headers, actions, handleSort, sortedColumn }: HeaderProps) {
  
  const renderSortIcon = (column: string) => {
    if (sortedColumn.sort !== column) {
      return <MdUnfoldMore size={16} className="cursor-pointer text-slate-400" />;
    }
    return sortedColumn.order === 'asc'
      ? <MdArrowUpward size={16} className="cursor-pointer text-slate-600" />
      : <MdArrowDownward size={16} className="cursor-pointer text-slate-600" />;
  };

  const getClassNameActionLabel = (item: TableHeaderItem) => {
    const className = [
      'flex',
      'items-center',
      'gap-1',
    ];
    if (item.sortable) {
      className.push('cursor-pointer');
    }

    if (item.uppercase) {
      className.push('uppercase');
    }
    return joinClass(className);
  };

  return (
    <thead className="bg-slate-50">
      <tr>
        { headers.map((item) => (
          <th
            key={item.value}
            role="columnheader"
            scope="col"
            align={item.align ?? 'left'}
            style={item.style}
            aria-label={item.label}
            className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-600"
          >
            <button type="button" className={getClassNameActionLabel(item)} onClick={() => {
              if (!item.sortable) {
                return;
              }
              handleSort(item);
            }}>
              <span>{item.label}</span>
              {item.sortable && renderSortIcon(item.value)}
            </button>
          </th>
        ))}
        { actions && (
          <th
            role="columnheader"
            scope="col"
            align={actions.align ?? 'left'}
            aria-label={actions.text ?? 'Actions'}
            className={`px-4 py-3 text-xs font-semibold tracking-wide text-slate-600 ${actions.uppercase ? 'uppercase' : ''}`}
          >
            { actions?.text ?? 'Actions'}
          </th>
        )}
      </tr>
    </thead>
  );
}
