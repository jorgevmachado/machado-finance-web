import React from 'react';

import { joinClass } from '@/app/utils';
import { TableHeaderItem } from '../header';
import { tableBusiness } from '../business';
import { BodyAction ,type TableActions } from './action';

type BodyProps = {
  items: Array<unknown>;
  headers: Array<TableHeaderItem>;
  actions?: TableActions
  onRowClick?: (item: unknown) => void;
  onCellClick?: (item: unknown) => void;
  formattedDate?: boolean;
  getClassNameRow?(item: unknown): string;
}

export default function Body({
  items,
  headers,
  actions,
  onRowClick,
  onCellClick,
  formattedDate
}: BodyProps) {
  const classNameConditionColor = (header: TableHeaderItem, item: unknown) => {
    const className = [
      'whitespace-nowrap',
      'px-4',
      'py-3',
      'text-sm',
      'text-slate-700',
    ];
    if (onCellClick) {
      className.push('cursor-pointer transition-colors hover:bg-slate-50');
    }
    if (header.conditionColor) {
      const condition = header.value;
      const conditionValue = (item as Record<string ,unknown>)[condition];
      const trueColor = header.conditionColor.trueColor;
      const falseColor = header.conditionColor.falseColor;
      if (conditionValue) {
        className.push(trueColor);
        className.push('text-white');
      } else {
        className.push(falseColor);
        className.push('text-white');
      }
    }
    return joinClass(className);
  };

  const handleOnCellClick = ( 
    event: React.MouseEvent<HTMLTableDataCellElement> ,
    header: TableHeaderItem ,
    item: unknown
  ) => {
    event.preventDefault();
    const header_value = header.value;
    const [value] = header_value.split('.');
    const data = (item as Record<string ,unknown>)[value];
    onCellClick?.(data);
  };

  return (
    <tbody className="divide-y divide-slate-100 bg-white">
      {items.map((item: unknown, index: number) => (
        <tr
          key={`table-row-${index}`}
          role={onRowClick ? 'button' : undefined}
          onClick={onRowClick
            ? (event) => {
              event.preventDefault();
              onRowClick(item);
            }
            : undefined}
          tabIndex={onRowClick ? 0 : undefined}
          className={onRowClick ? 'cursor-pointer transition-colors hover:bg-slate-50' : ''}
          onKeyDown={onRowClick
            ? (event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                onRowClick(item);
              }
            }
            : undefined}
        >
          {headers.map((header, index) => (
            <td
              key={`${header.value}-${index}`}
              align={header.align ?? 'left'}
              onClick={onCellClick  ? (event) => handleOnCellClick(event, header, item) : undefined}
              className={classNameConditionColor(header, item)}>
              {tableBusiness.renderData(item, header, formattedDate)}
            </td>
          ))}
          { actions && (
            <td
              align={actions.align ?? 'center'}
              className="whitespace-nowrap px-4 py-3 text-sm text-slate-700">
              {actions.show &&(
                <BodyAction type="show" item={item} action={actions.show} />
              )}
              {actions.edit &&(
                <BodyAction type="edit" item={item} action={actions.edit} />
              )}
              {actions.delete && (
                <BodyAction type="delete" item={item} action={actions.delete} />
              )}
            </td>
          )}
        </tr>
      ))}
    </tbody>
  );
}