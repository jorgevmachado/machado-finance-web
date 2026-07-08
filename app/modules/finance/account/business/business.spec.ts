import { AccountBusiness } from './business';
import type { TAccount } from '../types';

describe('AccountBusiness', () => {
  const accountBusiness = new AccountBusiness();

  it('normalizes name and keeps optional filters undefined when empty', () => {
    const result = accountBusiness.normalizeFilters({
      name: '   Main account   ',
      type: undefined,
      is_active: undefined,
    });

    expect(result).toEqual({
      name: 'Main account',
      type: undefined,
      is_active: undefined,
    });
  });

  it('normalizes undefined name to undefined', () => {
    const result = accountBusiness.normalizeFilters({
      name: undefined,
      type: 'BANK',
      is_active: true,
    });

    expect(result).toEqual({
      name: undefined,
      type: 'BANK',
      is_active: true,
    });
  });

  it('builds response message based on action state', () => {
    const message = accountBusiness.getResponseMessage({
      type: 'create',
      status: 'success',
      message: '',
    });

    expect(message).toBe('account.success.create');
  });

  it('returns original account by id from table item', () => {
    const items: Array<TAccount> = [
      {
        id: 'account-1',
        name: 'Main',
        type: 'BANK',
        incomes: [],
        is_active: true,
        allocations: [] ,
        finance_id: 'finance-1' ,
        created_at: new Date('2026-01-01T00:00:00.000Z'),
        initial_balance: 1000,
        current_balance: 1200,
        incoming_transfers: [],
        outgoing_transfers: [],
      },
    ];

    const result = accountBusiness.getOriginalAccount(items, { id: 'account-1' });

    expect(result).toEqual(items[0]);
  });

  it('returns undefined when table item id is not found', () => {
    const items: Array<TAccount> = [
      {
        id: 'account-1',
        name: 'Main',
        type: 'BANK',
        incomes: [],
        is_active: true,
        allocations: [] ,
        finance_id: 'finance-1' ,
        created_at: new Date('2026-01-01T00:00:00.000Z'),
        initial_balance: 1000,
        current_balance: 1200,
        incoming_transfers: [],
        outgoing_transfers: [],
      },
    ];

    const result = accountBusiness.getOriginalAccount(items, { id: 'account-2' });

    expect(result).toBeUndefined();
  });

  it('initializes draft from existing account', () => {
    const draft = accountBusiness.initDraftAccount({
      id: 'account-1',
      name: 'Main',
      type: 'BANK',
      incomes: [],
      is_active: true,
      allocations: [] ,
      finance_id: 'finance-1' ,
      created_at: new Date('2026-01-01T00:00:00.000Z'),
      initial_balance: 1000,
      current_balance: 1200,
      incoming_transfers: [],
      outgoing_transfers: [],
    });

    expect(draft).toEqual({
      name: 'Main',
      type: 'BANK',
      initial_balance: 1000,
    });
  });

  it('initializes empty draft when no account is provided', () => {
    const draft = accountBusiness.initDraftAccount();

    expect(draft).toEqual({
      name: '',
      type: '',
      initial_balance: '',
    });
  });
});
