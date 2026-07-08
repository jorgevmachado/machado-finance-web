import { useMemo } from 'react';

import { useAppTranslation } from '@/app/shared';

import { Table } from '@/app/ds';

import { movementBusiness } from '../../../movement';

import type { TIncome } from '../../types';

type IncomeListProps = {
  incomes: Array<TIncome>;
  referenceYear: number;
}

export default function IncomeList({ incomes, referenceYear }: IncomeListProps) {
  const { t } = useAppTranslation();

  const incomeTable = useMemo(() => {
    return movementBusiness.generateMovementTable({
      entities: incomes,
      referenceYear,
      chooseValues: ['source', 'total'],
    });
  }, [incomes, referenceYear]);

  return (
    <div>
      <h1>Incomes ({referenceYear})</h1>
      <Table
        items={incomeTable.body}
        headers={incomeTable.headers.map((header) => ({ ...header, label: t(header.label) }))}
        showNotFoundError={true}
      />
    </div>
  );
}