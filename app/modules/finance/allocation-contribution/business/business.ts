import type { TAllocationContribution, TAllocationContributionGroup } from '../types';

export class AllocationContributionBusiness {
  public groupByLocationId(items: Array<TAllocationContribution>): Array<TAllocationContributionGroup> {
    const groups = items.reduce<Map<string, Array<TAllocationContribution>>>((accumulator, item) => {
      const locationId = item.allocation?.id ?? 'unknown';
      const groupItems = accumulator.get(locationId);

      if (groupItems) {
        groupItems.push(item);
        return accumulator;
      }

      accumulator.set(locationId, [item]);
      return accumulator;
    }, new Map());

    return Array.from(groups.values()).map((data) => {
      const expenses = data.flatMap((item) => item.allocation?.expenses ?? []);
      const mergedExpenses = Array.from(new Map(expenses.map((expense) => [expense.id, expense])).values());

      return {
        allocation: data[0].allocation,
        expenses: mergedExpenses,
        allocationContributions: data,
      };
    });
  }
}
