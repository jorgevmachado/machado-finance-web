import React from 'react';

import { ETypeTableHeader } from '../header';
import type { TableHeaderItem } from '../header';
import { TableBusiness } from './business';

describe('table business', () => {
  const business = new TableBusiness();

  it('returns new ascending sort for a different column', () => {
    const header: TableHeaderItem = { label: 'Name', value: 'name', sortable: true };
    const result = business.getNewSort(header, { sort: 'id', order: 'asc' });

    expect(result).toEqual({ sort: 'name', order: 'asc' });
  });

  it('toggles and resets sorting for the same column', () => {
    const header: TableHeaderItem = { label: 'Name', value: 'name', sortable: true };

    const toggled = business.getNewSort(header, { sort: 'name', order: 'asc' });
    const reset = business.getNewSort(header, { sort: 'name', order: 'desc' });

    expect(toggled).toEqual({ sort: 'name', order: 'desc' });
    expect(reset).toEqual({ sort: '', order: '' });
  });

  it('sorts by nested values', () => {
    const result = business.sortItems(
      { sort: 'user.name', order: 'asc' },
      [{ user: { name: 'Charlie' } }, { user: { name: 'Alice' } }, { user: { name: 'Bob' } }]
    );

    expect((result[0] as unknown as { user: { name: string } }).user.name).toBe('Alice');
    expect((result[1] as unknown as { user: { name: string } }).user.name).toBe('Bob');
    expect((result[2] as unknown as { user: { name: string } }).user.name).toBe('Charlie');
  });

  it('renders nested value by path', () => {
    const value = business.renderValue({ user: { profile: { name: 'Ana' } } }, 'user.profile.name');
    expect(value).toBe('Ana');
  });

  it('formats DATE and MONEY values when needed', () => {
    const date = business.renderDataItem('2024-01-15', ETypeTableHeader.DATE, true);
    const money = business.renderDataItem(5000, ETypeTableHeader.MONEY);

    expect(typeof date).toBe('string');
    expect(money).toBe('R$ 5.000,00');
  });

  it('returns React node as-is and null for unsupported value', () => {
    const node = React.createElement('span', { 'data-testid': 'custom-node' }, 'X');
    const nodeResult = business.renderDataItem(node);
    const nullResult = business.renderDataItem({ foo: 'bar' });

    expect(React.isValidElement(nodeResult)).toBe(true);
    expect(nullResult).toBeNull();
  });
});
