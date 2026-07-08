import React from 'react';
import { currencyFormatter } from '@/app/utils';

import type { SortedColumn } from '../types';
import { ETypeTableHeader ,TableHeaderItem } from '../header';

type SortItem = {
  [key: string]: string | number;
};

export class TableBusiness {
  public resetSortedColumn: SortedColumn = {
    order: '',
    sort: '',
  };

  public getNewSort(
    header: TableHeaderItem,
    sortedColumn: SortedColumn,
  ): SortedColumn {
    if (sortedColumn.sort === header.value) {
      return sortedColumn.order !== 'desc'
        ? { ...sortedColumn, order: 'desc' }
        : this.resetSortedColumn;
    }
    return { order: 'asc', sort: header.value };
  }


  public sortItems(sortedColumn: SortedColumn, items: Array<unknown>) {
    const itemsCopy = [...items] as Array<SortItem>;

    itemsCopy.sort((a: SortItem, b: SortItem) => {
      const valueA = this.getNestedValue(a, sortedColumn.sort);
      const valueB = this.getNestedValue(b, sortedColumn.sort);

      if (valueA === undefined || valueB === undefined) return 0;

      if (sortedColumn.order === 'asc') {
        return valueA < valueB ? -1 : 1;
      }

      if (sortedColumn.order === 'desc') {
        return valueA > valueB ? -1 : 1;
      }

      return 0;
    });

    return itemsCopy;
  }
  
  public renderValue(item: unknown, value: string) {
    return value
      .split('.')
      .reduce((acc, key) => acc && (acc as Record<string, unknown>)[key], item);
  }

  public renderData(item: unknown, header: TableHeaderItem, formattedDate?: boolean): React.ReactNode {
    const value = this.renderValue(item, header.value);

    return this.renderDataItem(value, header.type, formattedDate);

  }

  public renderDataItem(value: unknown, type?: ETypeTableHeader, formattedDate?: boolean): React.ReactNode {
    if (React.isValidElement(value)) {
      return value;
    }

    if (typeof value === 'string' || typeof value === 'number') {
      if (type === ETypeTableHeader.DATE && formattedDate) {
        return new Date(value).toLocaleDateString();
      }

      if (type === ETypeTableHeader.MONEY) {
        const valueNumber =
          typeof value === 'string' ? parseFloat(value) : value;
        return currencyFormatter(valueNumber);
      }

      return value;
    }

    return null;
  }

  private getNestedValue(obj: any, key: string): any {
    return key.split('.').reduce((acc, part) => acc && acc[part], obj);
  }
}