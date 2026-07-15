'use client';
import React ,{ useMemo } from 'react';

import { useAppTranslation } from '@/app/shared';

import { Table ,Text } from '@/app/ds';

import { movementBusiness } from '../../../movement';

import type { TIncome } from '../../types';


type IncomeListProps = {
  incomes: Array<TIncome>;
  referenceYear: number;
  onPersist: (item?: unknown, disabled?: boolean) => void;
}

export default function IncomeList({ incomes, referenceYear, onPersist }: IncomeListProps) {
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
    <div className="flex w-full flex-col gap-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Text as="h2" className="text-3xl font-bold text-slate-950 sm:text-4xl">
            { t('income.title') } ({ referenceYear })
          </Text>
        </div>
      </div>
      <div className="w-full overflow-x-auto">
        <Table
          items={incomeTable.body}
          headers={translatedHeaders}
          withFooter={true}
          onRowClick={(item) => onPersist(item)}
          showNotFoundError={true}
        />
      </div>
    </div>
  );
}
