import { TMonthKey ,TMonthMap ,TMonthSummary } from './types';
import { TEntityMonth } from '@/app/modules/finance';
import { TableHeaderItem } from '@/app/ds';
import { ETypeTableHeader } from '@/app/ds/table/header';
import { validateCreatedAt, validateValue } from '@/app/utils';

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

  private createMonthSummary(year: number, month: number, monthFormatter: Intl.DateTimeFormat, item?: Record<string, unknown>): TMonthSummary {
    const monthDate = new Date(Date.UTC(year, month - 1, 1));

    return {
      id: item?.['id'] as string | undefined,
      amount: validateValue((item?.['amount'] as number | undefined), 'number') as number,
      month: monthFormatter.format(monthDate),
      received_at: item?.['received_at'] as string | undefined,
      reference_month: month,
      reference_year: year,
    };
  }

  private createEmptyMonthMap(referenceYear: number, monthFormatter: Intl.DateTimeFormat): TMonthMap {
    return this.MONTH_KEYS.reduce((accumulator, monthKey, index) => {
      accumulator[monthKey] = this.createMonthSummary(referenceYear, index + 1, monthFormatter);
      return accumulator;
    }, {} as TMonthMap);
  }

  private buildEntityMonths(months: Array<Record<string, unknown>>, referenceYear: number): Array<TEntityMonth> {
    const entityMonths = months.map((month) => {
      const id = validateValue(month?.['id'] as string, 'string') as string;
      const amount = validateValue((month?.['amount'] as number | undefined), 'number') as number;
      const reference_year = validateValue((month?.['reference_year'] as number | undefined), 'number') as number;
      const reference_month = validateValue((month?.['reference_month'] as number | undefined), 'number') as number;
      const created_at = validateCreatedAt(month?.['created_at'] as string | undefined) as Date;
      return {
        id,
        amount,
        reference_year,
        reference_month,
        created_at,
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
    const entityMonths = this.buildEntityMonths(months, referenceYear);
    const monthMap = this.createEmptyMonthMap(referenceYear, monthFormatter);
    
    for (const month of entityMonths) {
      if (!month) {
        continue;
      }
      const monthKey = this.MONTH_KEYS[month.reference_month - 1];
      monthMap[monthKey].amount = month.amount;
    }
    return monthMap;
  }

  public generateTableHeaderMonths(
    align: TableHeaderItem['align'] = 'right',
    sortable: boolean = true
  ): Array<TableHeaderItem> {
    return this.MONTH_KEYS.map((monthKey) => ({
      value: `${monthKey}.amount`,
      type: ETypeTableHeader.MONEY,
      label: `month.${monthKey.trim().slice(0,3)}`,
      align,
      sortable,
    }));
  }

}