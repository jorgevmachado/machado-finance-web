'use client';
import React ,{ useMemo ,useState } from 'react';

import { Text } from '@/app/ds';

import Header ,{ type TableHeaderItem } from './header';
import type { SortedColumn } from './types';
import { Body, type TableActions } from './body';
import { getNewSort ,sortItems } from './sort';

type TableProps = {
  items: Array<unknown>;
  headers: Array<TableHeaderItem>;
  actions?: TableActions
  onRowClick?(item: unknown): void;
  sortedColumn?: SortedColumn;
  formattedDate?: boolean;
  onChangeOrder?(sortedColumn: SortedColumn): void;
  onSortedColumn?(sortedColumn: SortedColumn): void;
  getClassNameRow?(item: unknown): string;
  notFoundMessage?: string;
  showNotFoundError?: boolean;
};
export default function Table({
  items,
  headers,
  actions,
  onRowClick,
  sortedColumn = { sort: '', order: '' },
  formattedDate,
  onChangeOrder,
  onSortedColumn,
  getClassNameRow,
  notFoundMessage,
  showNotFoundError
}: TableProps) {

  const [currentSortedColumn, setCurrentSortedColumn] = useState<SortedColumn>(sortedColumn);

  const sortedItems = useMemo(() => {
    const list = [...(items ?? [])];

    if (currentSortedColumn.sort && currentSortedColumn.sort !== '') {
      return sortItems(currentSortedColumn, list);
    }
    return list;
  } ,[items ,currentSortedColumn]);

  const handleSort = (header: TableHeaderItem) => {
    const newSort = getNewSort(header, currentSortedColumn);
    setCurrentSortedColumn(newSort);
    if (onChangeOrder) {
      onChangeOrder(newSort);
    }
    if (onSortedColumn) {
      onSortedColumn(newSort);
    }
  };

  if (!showNotFoundError && sortedItems.length === 0) {
    return null;
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      { sortedItems.length === 0 && showNotFoundError && (
        <div className="flex h-full w-full items-center justify-center p-4">
          <Text className="text-slate-600">{notFoundMessage ? notFoundMessage : 'No data found!!'}</Text>
        </div>
      )}
      { sortedItems.length > 0 && (
        <table className="min-w-full divide-y divide-slate-200">
          <Header
            headers={headers}
            actions={actions}
            handleSort={handleSort}
            sortedColumn={currentSortedColumn}
          />
          <Body
            items={sortedItems}
            headers={headers}
            actions={actions}
            onRowClick={onRowClick}
            formattedDate={formattedDate}
            getClassNameRow={getClassNameRow}
          />
        </table>
      )}
    </div>
  );
}