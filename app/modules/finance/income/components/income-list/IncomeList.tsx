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

  const textTree = useMemo(() => {
    return [
      { value: 'source', label: 'income.source' },
      { value: 'total', label: 'common.total' },
    ];
  }, []);

  const incomeTable = useMemo(() => {
    return movementBusiness.generateMovementTable({
      entities: incomes,
      sortable: true,
      referenceYear,
      chooseValues: textTree.map((item) => item.value),
    });
  }, [incomes, referenceYear, textTree]);

  const translatedHeaders = useMemo(() => {
    return incomeTable.headers.map((header) => {
      const translatedLabel = textTree.find((item) => item.value === header.value)?.label || header.label;
      const currentFooter  = textTree.find((item) => item.value === header.footer)?.label;
      const translatedFooter = currentFooter ? t(currentFooter.toString()) : header.footer;
      
      return {
        ...header,
        label: t(translatedLabel),
        footer: translatedFooter
      };
    });
  }, [incomeTable.headers, t, textTree]);

  return (
    <div>
      <h1>Incomes ({referenceYear})</h1>
      <Table
        items={incomeTable.body}
        headers={translatedHeaders}
        withFooter={true}
        onCellClick={(item) => console.log('# => income cell clicked => ', item)}
        showNotFoundError={true}
      />
    </div>
  );
}