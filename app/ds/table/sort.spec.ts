import { getNewSort, resetSortedColumn, sortItems } from './sort';
import type { SortedColumn } from './types';
import type { TableHeaderItem } from './header';

describe('sort.ts', () => {
  describe('resetSortedColumn', () => {
    it('should have empty sort and order', () => {
      expect(resetSortedColumn.sort).toBe('');
      expect(resetSortedColumn.order).toBe('');
    });
  });

  describe('getNewSort', () => {
    const header: TableHeaderItem = {
      label: 'Name',
      value: 'name',
      sortable: true,
    };

    it('should return ascending order when clicking a new column', () => {
      const currentSort: SortedColumn = { sort: 'id', order: 'asc' };
      const result = getNewSort(header, currentSort);

      expect(result.sort).toBe('name');
      expect(result.order).toBe('asc');
    });

    it('should toggle to desc when clicking the same column with asc order', () => {
      const currentSort: SortedColumn = { sort: 'name', order: 'asc' };
      const result = getNewSort(header, currentSort);

      expect(result.sort).toBe('name');
      expect(result.order).toBe('desc');
    });

    it('should reset sort when clicking the same column with desc order', () => {
      const currentSort: SortedColumn = { sort: 'name', order: 'desc' };
      const result = getNewSort(header, currentSort);

      expect(result.sort).toBe('');
      expect(result.order).toBe('');
    });

    it('should toggle to desc when clicking the same column with empty order', () => {
      const currentSort: SortedColumn = { sort: 'name', order: '' };
      const result = getNewSort(header, currentSort);

      expect(result.sort).toBe('name');
      expect(result.order).toBe('desc');
    });
  });

  describe('sortItems', () => {
    const items = [
      { name: 'Charlie', age: 30 },
      { name: 'Alice', age: 25 },
      { name: 'Bob', age: 35 },
    ];

    it('should sort items in ascending order', () => {
      const sortedColumn: SortedColumn = { sort: 'name', order: 'asc' };
      const result = sortItems(sortedColumn, items);

      expect(result[0].name).toBe('Alice');
      expect(result[1].name).toBe('Bob');
      expect(result[2].name).toBe('Charlie');
    });

    it('should sort items in descending order', () => {
      const sortedColumn: SortedColumn = { sort: 'name', order: 'desc' };
      const result = sortItems(sortedColumn, items);

      expect(result[0].name).toBe('Charlie');
      expect(result[1].name).toBe('Bob');
      expect(result[2].name).toBe('Alice');
    });

    it('should sort numeric values correctly', () => {
      const sortedColumn: SortedColumn = { sort: 'age', order: 'asc' };
      const result = sortItems(sortedColumn, items);

      expect(result[0].age).toBe(25);
      expect(result[1].age).toBe(30);
      expect(result[2].age).toBe(35);
    });

    it('should not modify original array', () => {
      const sortedColumn: SortedColumn = { sort: 'name', order: 'asc' };
      const originalItems = [...items];
      sortItems(sortedColumn, items);

      expect(items).toEqual(originalItems);
    });

    it('should return unchanged list when sort order is empty', () => {
      const sortedColumn: SortedColumn = { sort: 'name', order: '' };
      const result = sortItems(sortedColumn, items);

      expect(result).toEqual(items);
    });

    it('should handle nested object properties', () => {
      const nestedItems = [
        { user: { name: 'Charlie' } },
        { user: { name: 'Alice' } },
        { user: { name: 'Bob' } },
      ];
      const sortedColumn: SortedColumn = { sort: 'user.name', order: 'asc' };
      const result = sortItems(sortedColumn, nestedItems);

      expect((result[0].user as any).name).toBe('Alice');
      expect((result[1].user as any).name).toBe('Bob');
      expect((result[2].user as any).name).toBe('Charlie');
    });

    it('should handle undefined values gracefully', () => {
      const itemsWithUndefined = [
        { name: 'Charlie', value: 30 },
        { name: 'Alice', value: undefined },
        { name: 'Bob', value: 35 },
      ];
      const sortedColumn: SortedColumn = { sort: 'value', order: 'asc' };
      const result = sortItems(sortedColumn, itemsWithUndefined);

      expect(result.length).toBe(3);
    });
  });
});
