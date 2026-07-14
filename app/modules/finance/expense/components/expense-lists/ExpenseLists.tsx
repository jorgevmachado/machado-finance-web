'use client';
import { useMemo } from 'react';

import type { TExpense } from '@/app/modules/finance';

import { ExpenseList } from '@/app/modules/finance/expense';
import Accordion from '@/app/ds/accordion';
import { expenseBusiness } from '@/app/modules/finance/expense/business';
import { currencyFormatter } from '@/app/utils';


type ExpenseListsProps = {
  expenses: Array<TExpense>;
  referenceYear: number;
  onPersist: (item?: unknown, disabled?: boolean) => void;
}

type ExpenseListChildren = {
  parent: string;
  children: Array<TExpense>;
}

export default function ExpenseLists({ expenses, referenceYear, onPersist }: ExpenseListsProps) {

  const expensesParents = useMemo(() => {
    return expenses.filter((expense) => !expense.parent_id && expense?.children && expense.children.length > 0);
  }, [expenses]);

  const expensesSingles = useMemo(() => {
    return expenses.filter((expense) => !expense.parent_id && expense?.children?.length === 0);
  }, [expenses]);
  
  
  const expensesListChildren = useMemo(() => {
    const result: Array<ExpenseListChildren> =  [];
    for (const parent of expensesParents) {
      const children = expenses.filter((expense) => expense.parent_id === parent.id);
      if (children.length > 0) {
        result.push({ parent: parent.payee, children });
      }
    }
    return result;
  }, [expensesParents, expenses]);
  
  return (
    <div className="flex flex-col gap-6">
      { expensesSingles && expensesSingles.length > 0 && (
        <ExpenseList expenses={expensesSingles} referenceYear={referenceYear} onPersist={onPersist}/>
      )}

      { expensesParents && expensesParents.length > 0 && (
        <ExpenseList expenses={expensesParents} referenceYear={referenceYear}/>
      )}

      { expensesListChildren && expensesListChildren.length > 0 && expensesListChildren.map((expenseListChildren) => (
        <Accordion title={expenseListChildren.parent} subtitle={currencyFormatter(expenseBusiness.totalExpenses(expenseListChildren.children))} key={expenseListChildren.parent}>
          <ExpenseList expenses={expenseListChildren.children} referenceYear={referenceYear} onPersist={onPersist}/>
        </Accordion>
      ))}
    </div>
  );
}