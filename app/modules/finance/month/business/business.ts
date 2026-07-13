import {
  BuildMonthPersistByInstallmentsParams ,
  TMonthKey ,TMonthMap ,TMonthSummary,
} from './types';
import { TableHeaderItem, ETypeTableHeader } from '@/app/ds';
import {
  validateBasicEntity ,
  validateValue ,
} from '@/app/utils';
import { TEntity } from '@/app/modules';
import { EMonthStatus  } from '@/app/modules/finance';
import { TMonthPersist } from '@/app/modules/finance/month';
import { TConvertMonthPersistOptions } from './types';

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
    const receivedAt = this.normalizeMonthDate(item?.['received_at']);
    const paidAt = this.normalizeMonthDate(item?.['paid_at']);
    const transactionDate = this.normalizeMonthDate(item?.['transaction_date']);
    const status = this.validateStatus(item?.['status']);
    return {
      ...entity,
      month: this.getMonthName(month, monthFormatter),
      amount: validateValue((item?.['amount'] as number | undefined), 'number') as number,
      status,
      received_at: receivedAt ?? transactionDate,
      paid_at: paidAt ?? transactionDate,
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
      const status = this.validateStatus(month?.['status']);
      const paid_at = this.normalizeMonthDate(month?.['paid_at']);
      const received_at = this.normalizeMonthDate(month?.['received_at']);
      const transaction_date = this.normalizeMonthDate(month?.['transaction_date']);
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
        status,
        paid_at,
        received_at: received_at ?? transaction_date,
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

  public convertToMonthPersist(
    monthsSummary: Array<TMonthSummary>,
    {
      dateField = 'received_at',
      includeStatus = true,
    }: TConvertMonthPersistOptions = {}
  ): Array<TMonthPersist> {
    return monthsSummary.map((summary) => {
      const monthDate = dateField === 'paid_at' ? summary.paid_at : summary.received_at;
      const transactionDate = monthDate ? new Date(monthDate) : undefined;
      const result: TMonthPersist = {
        amount: summary.amount,
        reference_day: 10 ,
        reference_month: summary.reference_month ,
        transaction_date: transactionDate
      };
      if (includeStatus && summary.status) {
        result.status = summary.status;
      }
      return result;
    });
  }

  public orderMonthsByReferenceMonth(months: Array<TMonthSummary>): Array<TMonthSummary> {
    return months.sort((a, b) => a.reference_month - b.reference_month);
  }

  private normalizeMonthDate(value: unknown): string | undefined {
    if (!value) {
      return undefined;
    }
    if (value instanceof Date) {
      return value.toISOString().slice(0, 10);
    }
    if (typeof value === 'string') {
      return value.slice(0, 10);
    }
    return undefined;
  }

  private getStatusByCurrentMonth(month: number, referenceMonth: number, paid: boolean = false): EMonthStatus {
    if (month < referenceMonth) {
      return EMonthStatus.PAID;
    }
    if (month > referenceMonth) {
      return EMonthStatus.PENDING;
    }

    if (month === referenceMonth && paid) {
      return EMonthStatus.PAID;
    }

    return EMonthStatus.PENDING;
  }

  public buildMonthPersistByInstallments({
    paid = false,
    amount,
    withStatus = false,
    referenceDay,
    referenceMonth,
    transactionDate,
    totalOfInstallments
  }: BuildMonthPersistByInstallmentsParams): Array<TMonthPersist> {
    const months: Array<TMonthPersist> = [];
    const status = !paid ? EMonthStatus.PENDING : EMonthStatus.PAID;
    if (totalOfInstallments <= 0) {
      return months;
    }
    
    if (totalOfInstallments === 1) {
      months.push({
        status: withStatus ? status : undefined,
        amount: amount,
        reference_day: referenceDay,
        reference_month: referenceMonth,
        transaction_date: transactionDate,
      });
      return months;
    }
    const currentTransactionDate = new Date(transactionDate);
    this.MONTH_KEYS.forEach((_, index) => {
      const currentReferenceMonth = index + 1;
      if (currentReferenceMonth <= totalOfInstallments) {
        months.push({
          status: withStatus ? this.getStatusByCurrentMonth(currentReferenceMonth, referenceMonth, paid) : undefined,
          amount: amount,
          reference_day: referenceDay,
          reference_month: currentReferenceMonth,
          transaction_date: new Date(currentTransactionDate.getFullYear(), currentReferenceMonth - 1, currentTransactionDate.getDate()),
        });
      }
    });

    return months;
  }

}