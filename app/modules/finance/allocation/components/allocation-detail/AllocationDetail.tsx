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

  const expenseTable = useMemo(() => {
    return movementBusiness.generateMovementTable({
      entities: allocation.expenses,
      referenceYear,
      chooseValues: ['payee', 'category.name', 'total'],
    });
  }, [allocation.expenses, referenceYear]);

  return (
    <div>
      <Table
        items={expenseTable.body}
        headers={expenseTable.headers.map((header) => ({ ...header, label: t(header.label) }))}
        showNotFoundError={true}
      />
    </div>
  );
}