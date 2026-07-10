'use client';
import React  from 'react';
import { MdPieChart ,MdTrendingUp } from 'react-icons/md';
import { useAppTranslation } from '@/app/shared';

import { Dropdown, Text } from '@/app/ds';

import type { TCategory } from '../../../category';
import { usePersistExpenseModal, ExpenseList } from '../../../expense';
import type { TAllocation } from '../../types';

type AllocationDetailProps = {
  categories: Array<TCategory>;
  allocation: TAllocation;
  referenceYear: number;
};

export default function AllocationDetail({ categories, allocation, referenceYear }: AllocationDetailProps) {
  const { t } = useAppTranslation();

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
      <div className="flex flex-col gap-10">
        {/*<Table*/}
        {/*  items={expenseTable.body}*/}
        {/*  headers={translatedHeaders}*/}
        {/*  withFooter={true}*/}
        {/*  showNotFoundError={true}*/}
        {/*/>*/}
        <ExpenseList expenses={allocation?.expenses ?? []} referenceYear={referenceYear} onPersist={openCreateExpense}/>
        {expenseModal}
      </div>
    </div>
  );
}