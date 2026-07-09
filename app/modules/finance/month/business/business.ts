import { TMonthKey ,TMonthMap ,TMonthSummary } from './types';
import { TableHeaderItem, ETypeTableHeader } from '@/app/ds';
import {
  validateBasicEntity ,
  validateDateAt ,
  validateValue ,
} from '@/app/utils';
import { TEntity } from '@/app/modules';
import { EMonthStatus  } from '@/app/modules/finance';
import { TMonthPersist } from '@/app/modules/finance/month';

export class MonthBusiness {
  public MONTH_KEYS: Array<TMonthKey> = [
    'january' ,
    'february' ,
    'march' ,
    'april' ,
    'may' ,
    'june' ,
    'july' ,
    'august' ,
    'september' ,
    'october' ,
    'november' ,
    'december'
  ];

  public monthFormatter = new Intl.DateTimeFormat('en-US', { month: 'long', timeZone: 'UTC' });

  public getMonthName(referenceMonth: number, monthFormatter: Intl.DateTimeFormat = this.monthFormatter): TMonthKey {
    const currentDate = new Date();
    const monthDate = new Date(Date.UTC(currentDate.getUTCFullYear(), referenceMonth - 1, 1));
    return monthFormatter.format(monthDate).toLowerCase() as TMonthKey;
  }

  public createMonthSummary(year: number, month: number, item?: Record<string, unknown>, monthFormatter: Intl.DateTimeFormat = this.monthFormatter): TMonthSummary {
    const entity = item ?  validateBasicEntity<TEntity>(item) : { id: '', created_at: new Date(), updated_at: undefined, deleted_at: undefined };
    return {
      ...entity,
      month: this.getMonthName(month, monthFormatter),
      amount: validateValue((item?.['amount'] as number | undefined), 'number') as number,
      received_at: item?.['received_at'] as string | undefined,
      reference_month: month,
      reference_year: year,
    };
  }

  private createEmptyMonthMap(referenceYear: number, monthFormatter: Intl.DateTimeFormat): TMonthMap {
    return this.MONTH_KEYS.reduce((accumulator, monthKey, index) => {
      accumulator[monthKey] = this.createMonthSummary(referenceYear, index + 1, undefined, monthFormatter);
      return accumulator;
    }, {} as TMonthMap);
  }

  private buildMonthSummary(months: Array<Record<string, unknown>>, referenceYear: number, monthFormatter: Intl.DateTimeFormat): Array<TMonthSummary> {
    const entityMonths = months.map((month) => {
      const entity =  validateBasicEntity<TEntity>(month);
      const amount = validateValue((month?.['amount'] as number | undefined), 'number') as number;
      const paid_at = validateDateAt(month?.['paid_at'] as string | undefined) as Date | undefined;
      const income_id = validateValue((month?.['income_id'] as string | undefined), 'string') as string;
      const expense_id = validateValue((month?.['expense_id'] as string | undefined), 'string') as string;
      const reference_year = validateValue((month?.['reference_year'] as number | undefined), 'number') as number;
      const reference_month = validateValue((month?.['reference_month'] as number | undefined), 'number') as number;
      const allocation_contribution_id = validateValue((month?.['allocation_contribution_id'] as string | undefined), 'string') as string;
      const monthDate = new Date(Date.UTC(referenceYear, reference_month - 1, 1));

      return {
        ...entity,
        amount,
        month: monthFormatter.format(monthDate),
        paid_at,
        income_id: income_id === 'unknown' ? undefined : income_id,
        expense_id: expense_id === 'unknown' ? undefined : expense_id,
        reference_year,
        reference_month,
        allocation_contribution_id: allocation_contribution_id === 'unknown' ? undefined : allocation_contribution_id,
      };
    });
    const sortedEntityMonths = entityMonths.sort((a, b) => a.reference_month - b.reference_month);
    return sortedEntityMonths.filter((month) => Number(month.reference_year) === Number(referenceYear));
  }

  public generateMonthMap(
    months: Array<Record<string, unknown>>,
    referenceYear: number,
    monthFormatter: Intl.DateTimeFormat = this.monthFormatter
  ): TMonthMap {
    const entityMonths = this.buildMonthSummary(months, referenceYear, monthFormatter);
    const monthMap = this.createEmptyMonthMap(referenceYear, monthFormatter);
    
    for (const month of entityMonths) {
      if (!month) {
        continue;
      }
      const monthKey = this.MONTH_KEYS[month.reference_month - 1];
      month.month = monthMap[monthKey].month;
      monthMap[monthKey] = month;
    }
    return monthMap;
  }

  private calculateTotalAmountByMonth(body: Array<Record<string, unknown>>, month: TMonthKey) {
    return  body.reduce((accumulator, item) => {
      const monthData = item?.[month] as Record<string, unknown> | undefined;
      if (monthData) {
        const amount = monthData?.['amount'] as number | undefined;
        return accumulator + (amount || 0);
      }
      return accumulator;
    }, 0);
  }

  public generateTableHeaderMonths(
    body: Array<Record<string, unknown>>,
    align: TableHeaderItem['align'] = 'right',
    sortable: boolean = true
  ): Array<TableHeaderItem> {
    return this.MONTH_KEYS.map((monthKey) => ({
      value: `${monthKey}.amount`,
      type: ETypeTableHeader.MONEY,
      label: `month.${monthKey.trim().slice(0,3)}`,
      footer: this.calculateTotalAmountByMonth(body, monthKey),
      align,
      sortable,
    }));
  }

  private validateStatus(status: unknown): EMonthStatus | undefined {
    if (typeof status === 'string' && Object.values(EMonthStatus).includes(status as EMonthStatus)) {
      return status as EMonthStatus;
    }
    return undefined;

  }

  public convertToMonthSummary(monthData: Record<string, unknown>, referenceYear: number): TMonthSummary {
    const monthKey = this.MONTH_KEYS.indexOf(monthData.month as TMonthKey);
    const reference_month = monthData.reference_month as number | undefined;
    return this.createMonthSummary(referenceYear, reference_month ?? monthKey - 1 , monthData);
  }

  public convertListToMonthSummary(months: Array<Record<string, unknown>>, referenceYear: number): Array<TMonthSummary> {
    return months.map((month) => this.convertToMonthSummary(month, referenceYear));
  }

  public convertToMonthPersist(monthsSummary: Array<TMonthSummary>): Array<TMonthPersist> {
    return monthsSummary.map((summary) => {
      const received_at = summary.received_at ? new Date(summary.received_at) : undefined;
      const result: TMonthPersist = {
        amount: summary.amount,
        status: summary?.status ,
        reference_day: 10 ,
        reference_month: summary.reference_month ,
        transaction_date: received_at
      };
      return result;
    });
  }

  public orderMonthsByReferenceMonth(months: Array<TMonthSummary>): Array<TMonthSummary> {
    return months.sort((a, b) => a.reference_month - b.reference_month);
  }

}