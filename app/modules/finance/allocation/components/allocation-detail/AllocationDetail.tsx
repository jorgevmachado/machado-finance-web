import React ,{ useMemo } from 'react';

import { useAppTranslation } from '@/app/shared';

import { Dropdown ,Table ,Text } from '@/app/ds';

import { movementBusiness } from '../../../movement';
import type { TCategory } from '../../../category';
import type { TAllocation } from '../../types';
import { MdPieChart ,MdTrendingUp } from 'react-icons/md';
import { usePersistExpenseModal } from '@/app/modules/finance/expense';


type AllocationDetailProps = {
  categories: Array<TCategory>;
  allocation: TAllocation;
  referenceYear: number;
};

export default function AllocationDetail({ categories, allocation, referenceYear }: AllocationDetailProps) {
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

  const { openPersist: openCreateExpense, modal: expenseModal } = usePersistExpenseModal({
    expenses: allocation?.expenses ?? [],
    categories,
    allocation,
  });

  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Text as="h2" className="text-3xl font-bold text-slate-950 sm:text-4xl">
            { allocation.name } ({ referenceYear })
          </Text>
        </div>
        <div className="flex justify-end">
          <Dropdown
            align="right"
            items={[
              {
                label: t('expense.create.title'),
                icon: <MdTrendingUp size={16} />,
                iconPosition: 'left',
                onClick: () => openCreateExpense(),
              },
              {
                label: t('allocation-contribution.create.title'),
                icon: <MdPieChart size={16} />,
                iconPosition: 'left',
                onClick: () => console.log('# => Open Create Contributions'),
              },
            ]}
          />
        </div>
      </div>
      <Table
        items={expenseTable.body}
        headers={translatedHeaders}
        withFooter={true}
        showNotFoundError={true}
      />
      {expenseModal}
    </div>
  );
}