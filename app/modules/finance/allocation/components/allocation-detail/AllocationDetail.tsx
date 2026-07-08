import { useMemo } from 'react';

import { useAppTranslation } from '@/app/shared';

import { Table } from '@/app/ds';

import { movementBusiness } from '@/app/modules/finance';

import type { TAllocation } from '../../types';


type AllocationDetailProps = {
  allocation: TAllocation;
  referenceYear: number;
};

export default function AllocationDetail({ allocation, referenceYear }: AllocationDetailProps) {
  const { t } = useAppTranslation();

  const textTree = useMemo(() => {
    return [
      { value: 'payee', label: 'expense.title' },
      { value: 'category.name', label: 'expense.category.name' },
      { value: 'total', label: 'common.total' },
    ];
  }, []);
  
  const expenseTable = useMemo(() => {
    return movementBusiness.generateMovementTable({
      entities: allocation.expenses,
      sortable: true,
      referenceYear,
      chooseValues: textTree.map((item) => item.value),
    });
  }, [allocation.expenses, referenceYear, textTree]);
  
  const translatedHeaders = useMemo(() => {
    return expenseTable.headers.map((header) => {
      const translatedLabel = textTree.find((item) => item.value === header.value)?.label || header.label;
      const currentFooter  = textTree.find((item) => item.value === header.footer)?.label;
      const translatedFooter = currentFooter ? t(currentFooter.toString()) : header.footer;

      return  {
        ...header,
        label: t(translatedLabel),
        footer: translatedFooter,
      };
    });
  }, [expenseTable.headers, t, textTree]);

  return (
    <div>
      <Table
        items={expenseTable.body}
        headers={translatedHeaders}
        withFooter={true}
        showNotFoundError={true}
      />
    </div>
  );
}