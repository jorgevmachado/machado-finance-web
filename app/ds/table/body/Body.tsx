import React from 'react';
import { currencyFormatter ,joinClass } from '@/app/utils';

import { ETypeTableHeader ,TableHeaderItem } from '../header';
import { BodyAction, type TableActions } from './action';

type BodyProps = {
  items: Array<unknown>;
  headers: Array<TableHeaderItem>;
  actions?: TableActions
  onRowClick?: (item: unknown) => void;
  formattedDate?: boolean;
  getClassNameRow?(item: unknown): string;
}

export default function Body({
  items,
  headers,
  actions,
  onRowClick,
  formattedDate
}: BodyProps) {

  const renderValue = (item: unknown, value: string) => {
    return value
      .split('.')
      .reduce((acc, key) => acc && (acc as Record<string, unknown>)[key], item);
  };

  const renderData = (
    item: unknown,
    header: TableHeaderItem,
  ) : React.ReactNode => {
    const value = renderValue(item, header.value);

    if (React.isValidElement(value)) {
      return value;
    }

    if (typeof value === 'string' || typeof value === 'number') {
      if (header.type === ETypeTableHeader.DATE && formattedDate) {
        return new Date(value).toLocaleDateString();
      }

      if (header.type === ETypeTableHeader.MONEY) {
        const valueNumber =
          typeof value === 'string' ? parseFloat(value) : value;
        return currencyFormatter(valueNumber);
      }

      return value;
    }

    return null;
  };

  const classNameConditionColor = (header: TableHeaderItem, item: unknown) => {
    const className = [
      'whitespace-nowrap',
      'px-4',
      'py-3',
      'text-sm',
      'text-slate-700',
    ];
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
              className={classNameConditionColor(header, item)}>
              {renderData(item, header)}
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