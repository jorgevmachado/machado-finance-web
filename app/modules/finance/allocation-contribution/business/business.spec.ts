import { AllocationContributionBusiness } from './business';
import type { TAllocationContribution } from '../types';

describe('AllocationContributionBusiness', () => {
  const allocationContributionBusiness = new AllocationContributionBusiness();

  it('groups contributions by allocation id and returns allocation/expenses/allocationContributions format', () => {
    const items = [
      {
        id: '1',
        amount: 1500,
        account_id: 'account-1',
        finance_id: 'finance-1',
        allocation: {
          id: 'allocation-1',
          name: 'Residencial Ingrid',
          type: 'HOUSE',
          name_code: 'residencial_ingrid',
          is_active: true,
          finance_id: 'finance-1',
          description: 'desc',
          created_at: '2026-01-01T00:00:00.000Z',
          updated_at: null,
          deleted_at: null,
        },
        description: 'Depo',
        reference_year: 2026,
        reference_month: 1,
        contributor_name: 'Hayane',
        created_at: '2026-01-01T00:00:00.000Z',
        updated_at: null,
        deleted_at: null,
      },
      {
        id: '2',
        amount: 1500,
        account_id: 'account-1',
        finance_id: 'finance-1',
        allocation: {
          id: 'allocation-1',
          name: 'Residencial Ingrid',
          type: 'HOUSE',
          name_code: 'residencial_ingrid',
          is_active: true,
          finance_id: 'finance-1',
          description: 'desc',
          created_at: '2026-01-01T00:00:00.000Z',
          updated_at: null,
          deleted_at: null,
        },
        description: 'Depo',
        reference_year: 2026,
        reference_month: 2,
        contributor_name: 'Jorge',
        created_at: '2026-01-01T00:00:00.000Z',
        updated_at: null,
        deleted_at: null,
      },
      {
        id: '3',
        amount: 5000,
        account_id: 'account-1',
        finance_id: 'finance-1',
        allocation: {
          id: 'allocation-2',
          name: 'Residencial Monte Carlo',
          type: 'HOUSE',
          name_code: 'residencial_monte_carlo',
          is_active: true,
          finance_id: 'finance-1',
          description: 'desc',
          created_at: '2026-01-01T00:00:00.000Z',
          updated_at: null,
          deleted_at: null,
        },
        description: 'Contas',
        reference_year: 2026,
        reference_month: 1,
        contributor_name: 'Jorge',
        created_at: '2026-01-01T00:00:00.000Z',
        updated_at: null,
        deleted_at: null,
      },
    ] as Array<TAllocationContribution>;

    const result = allocationContributionBusiness.groupByLocationId(items);

    expect(result).toEqual([
      {
        allocation: items[0].allocation,
        expenses: [],
        allocationContributions: [items[0], items[1]],
      },
      {
        allocation: items[2].allocation,
        expenses: [],
        allocationContributions: [items[2]],
      },
    ]);
  });

  it('groups items without allocation id under unknown', () => {
    const items = [
      {
        id: '1',
        amount: 100,
        account_id: 'account-1',
        finance_id: 'finance-1',
        allocation: undefined,
        description: 'Missing allocation',
        reference_year: 2026,
        reference_month: 1,
        contributor_name: 'Hayane',
        created_at: '2026-01-01T00:00:00.000Z',
        updated_at: null,
        deleted_at: null,
      },
    ] as unknown as Array<TAllocationContribution>;

    const result = allocationContributionBusiness.groupByLocationId(items);

    expect(result).toEqual([
      {
        allocation: undefined,
        expenses: [],
        allocationContributions: [items[0]],
      },
    ]);
  });
});
