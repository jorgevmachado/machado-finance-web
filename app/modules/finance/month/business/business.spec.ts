import { EMonthStatus } from '../enum';
import { MonthBusiness } from './business';

describe('MonthBusiness', () => {
  const business = new MonthBusiness();

  it('starts installment persistence at the bill reference month', () => {
    const months = business.buildMonthPersistByInstallments({
      paid: false,
      amount: 100,
      withStatus: true,
      referenceDay: 10,
      referenceMonth: 7,
      transactionDate: new Date('2026-07-02T00:00:00.000Z'),
      currentInstallment: 1,
      totalOfInstallments: 3,
    });

    expect(months).toHaveLength(3);
    expect(months.map((month) => month.reference_month)).toEqual([7, 8, 9]);
    expect(months.map((month) => month.amount)).toEqual([100, 100, 100]);
    expect(months.map((month) => month.status)).toEqual([
      EMonthStatus.PENDING,
      EMonthStatus.PENDING,
      EMonthStatus.PENDING,
    ]);
  });

  it('persists installments from the beginning up to the last one', () => {
    const months = business.buildMonthPersistByInstallments({
      paid: true,
      amount: 89.9,
      withStatus: true,
      referenceDay: 10,
      referenceMonth: 6,
      transactionDate: new Date('2026-06-02T00:00:00.000Z'),
      currentInstallment: 6,
      totalOfInstallments: 8,
    });

    expect(months).toHaveLength(8);
    expect(months.map((month) => month.reference_month)).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);
    expect(months.slice(0, 6).map((month) => month.status)).toEqual([
      EMonthStatus.PAID,
      EMonthStatus.PAID,
      EMonthStatus.PAID,
      EMonthStatus.PAID,
      EMonthStatus.PAID,
      EMonthStatus.PAID,
    ]);
    expect(months.slice(6).map((month) => month.status)).toEqual([
      EMonthStatus.PENDING,
      EMonthStatus.PENDING,
    ]);
  });
});
