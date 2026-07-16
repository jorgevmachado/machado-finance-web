import { FiltersProps ,SelectOption } from '@/app/ds';

import { ActionState } from '@/app/modules/actions/state';

import { EMonthStatus ,monthBusiness ,type TMonthPersist } from '../../month';

import type { TCategory } from '../../category';

import {
  TDraftExpense ,
  TDraftExpenseUploaded ,
  TExpense ,
  TExpenseCreate ,
  TExpenseFilter ,
  TExpenseListPersist ,
  TExpenseUploadResponse ,
  TExpenseUploadExpenseItemResponse ,
  TPersistExpenseUploadInputs ,TExpenseMonth ,
} from '../types';
import { formatDateToDateString ,toSnakeCase } from '@/app/utils';

export class ExpenseBusiness {
  public INITIAL_FILTERS: TExpenseFilter = {
    payee: undefined ,
    category_id: undefined ,
    allocation_id: undefined ,
    reference_year: undefined ,
    reference_month: undefined ,
  };

  public INITIAL_INPUT_FILTERS: FiltersProps['filters'] = [
    {
      name: 'payee' ,
      label: 'expense.payee' ,
      type: 'text' ,
      value: '' ,
      placeholder: 'expense.form.placeholder.payee' ,
    } ,
    {
      name: 'reference_year' ,
      label: 'filters.year' ,
      type: 'number' ,
      value: '' ,
      placeholder: 'filters.yearPlaceholder' ,
    } ,
    {
      name: 'reference_month' ,
      label: 'filters.month' ,
      type: 'autocomplete' ,
      value: '' ,
      options: monthBusiness.MONTH_KEYS.map((key) => ({
        key: key ,
        value: key ,
        label: `month.${ key }`,
      })) ,
      placeholder: 'filters.monthPlaceholder' ,
    } ,
  ];

  public normalizeFilters(filters: TExpenseFilter): TExpenseFilter {
    return {
      payee: filters.payee?.trim() || undefined ,
      category_id: filters.category_id || undefined ,
      allocation_id: filters.allocation_id || undefined ,
      reference_year: filters.reference_year || undefined ,
      reference_month: filters.reference_month || undefined ,
    };
  }

  public getResponseMessage(actionState: ActionState) {
    return `expense.messages.${ actionState.status }.${ actionState.type }`;
  }

  public getOriginal(
    items: Array<TExpense> ,tableItem: unknown): TExpense | undefined {
    const itemId = (tableItem as TExpense)?.id;
    return items?.find((item) => item.id === itemId);
  }

  public initDraft(referenceYear: number ,expense?: TExpense): TDraftExpense {
    return {
      payee: expense?.payee || '' ,
      category_id: expense?.category?.id || '' ,
      description: expense?.description || '' ,
      allocation_id: expense?.allocation?.id || '' ,
      reference_year: referenceYear ,
    };
  }

  public getCategoryOptions(categories: Array<TCategory>): Array<SelectOption> {
    return categories.map((c) => ({ key: c.id ,value: c.id ,label: c.name }));
  }

  public initDraftExpenseUploaded(expenses: Array<TExpenseUploadExpenseItemResponse>): Array<TDraftExpenseUploaded> {
    return expenses.map((expense ,index) => ({ ...expense ,order: index + 1 }));
  }

  public initPersistExpenseUploadInputs(expense?: TDraftExpenseUploaded): TPersistExpenseUploadInputs {
    return {
      order: expense?.order || 0 ,
      payee: expense?.payee || '' ,
      amount: expense?.amount.toString() || '0' ,
      category: expense?.category ,
    };
  }

  public convertUploadedToPersist(
    response: TExpenseUploadResponse ,
    expenses: Array<TDraftExpenseUploaded> ,
    entities?: Array<TExpense>,
    paid: boolean = false,
  ): TExpenseListPersist {
    const allocation = response.allocation;
    const bank = response.bank;
    const reference_year = response.reference_year;
    const reference_month = response.reference_month;

    const bill_due_date = !response.bill_due_date ?
      new Date(reference_year ,reference_month - 1 ,10) :
      new Date(response.bill_due_date);

    const referenceDay = bill_due_date.getDate();

    const parent: TExpenseCreate = {
      payee: `Credit Card - (${ bank })` ,
      months: [] ,
      description: `${ allocation.description } - (${ bank })` ,
      category_id: response.category.id ,
      allocation_id: allocation.id ,
      reference_year: reference_year ,
    };

    const payeeCode = toSnakeCase(parent.payee);

    const parentEntity = entities?.find((e) => e.payee_code === payeeCode && e.allocation.id === parent.allocation_id);

    const expensesToPersist: Array<TExpenseCreate> = expenses.map((expense) => {
      const payee_code = toSnakeCase(expense.payee);

      const entity = entities?.find((e) => e.payee_code === payee_code && e.allocation.id === allocation.id);
      const entityMonths = entity?.months.filter((m) => m.reference_month < reference_month);

      const expenseToPersistMonths = monthBusiness.buildMonthPersistByInstallments({
        paid ,
        amount: expense.amount ,
        withStatus: true ,
        referenceDay ,
        referenceYear: reference_year ,
        referenceMonth: reference_month ,
        transactionDate: expense.date ,
        currentInstallment: expense.current_installment ,
        totalOfInstallments: expense.total_of_installments ,
        allInstallmentsPaid: expense.all_installments_paid ,
      });

      const months: Array<TMonthPersist> = [];
      monthBusiness.MONTH_KEYS.forEach((_, index) => {
        const expenseToPersistMonth = expenseToPersistMonths.find((m) => m.reference_month === index + 1);
        if (!expenseToPersistMonth) {
          return;
        }
        const entityMonth = entityMonths?.find((m) => m.reference_month === index + 1);
        if (!entityMonth) {
          months.push(expenseToPersistMonth);
          return;
        }

        const entityPaidAt = entityMonth.paid_at ? new Date(entityMonth.paid_at) : undefined;
        const entityTransactionDateDay = entityPaidAt ? entityPaidAt.getDate() : 10;

        months.push({
          status: entityMonth.status ,
          amount: entityMonth.amount ,
          reference_day: entityTransactionDateDay ,
          reference_month: entityMonth.reference_month ,
          transaction_date: entityPaidAt ? formatDateToDateString(entityPaidAt) : undefined ,
        });
      });

      return {
        payee: expense.payee ,
        months: months ,
        category_id: expense.category.id ,
        description: expense.payee ,
        allocation_id: allocation.id ,
        reference_year ,
        reference_month,
      };
    });
    parent.months = this.convertParentMonths(expensesToPersist, referenceDay, bill_due_date, paid, reference_month, parentEntity);
    return {
      parent ,
      expenses: expensesToPersist,
      reference_month,
    };
  }

  private convertParentMonths(expenses: Array<TExpenseCreate>, referenceDay: number, transaction_date: Date, paid: boolean, reference_month: number, parentEntity?: TExpense) {
    const months: Array<TMonthPersist> = [];
    const parentMonths = parentEntity?.months.filter((m) => m.reference_month < reference_month);
    monthBusiness.MONTH_KEYS.forEach((_, index) => {
      const parentMonth = parentMonths?.find((m) => m.reference_month === index + 1);
      if (parentMonth) {
        const parentTransactionDate = parentMonth.paid_at ? new Date(parentMonth.paid_at) : transaction_date;
        const parentReferenceDay = parentTransactionDate.getDate();
        months.push({
          status: parentMonth.status ,
          amount: parentMonth.amount ,
          reference_day: parentReferenceDay ,
          reference_month: parentMonth.reference_month ,
          transaction_date: formatDateToDateString(parentTransactionDate) ,
        });
        return;
      }
      const amount = this.calculateAmountByMonth(expenses ,index + 1);
      months.push({
        status: paid ? EMonthStatus.PAID : EMonthStatus.PENDING ,
        amount ,
        reference_day: referenceDay ,
        reference_month: index + 1 ,
        transaction_date: formatDateToDateString(transaction_date) ,
      });
    });
    return months;
  }

  public calculateAmountByMonth(expenses: Array<TExpenseCreate>, month: number): number {
    return expenses.reduce((total, expense) => {
      const monthData = expense.months.find((m) => m.reference_month === month);
      return total + (monthData?.amount || 0);
    }, 0);
  }

  public totalMonths(months: Array<TExpenseMonth>): number {
    return months.reduce((total, month) => total + (month.amount || 0), 0);
  }

  public totalExpenses(children: Array<TExpense>): number {
    return children.reduce((total, expense) => total + this.totalMonths(expense.months), 0);
  }
}