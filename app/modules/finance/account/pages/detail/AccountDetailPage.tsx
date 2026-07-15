'use client';
import React ,{ useEffect ,useMemo } from 'react';
import { MdPieChart, MdTrendingUp } from 'react-icons/md';

import { useAppTranslation } from '@/app/shared';
import { Dropdown ,Filters ,Text } from '@/app/ds';
import { useDetail } from '@/app/ui';
import { financeBffService ,useCategory } from '@/app/modules/finance';

import { accountBusiness } from '../../business';

import type {
  TAccount ,
  TAccountFilter ,
} from '../../types';

import {
  IncomeList ,
  usePersistIncomeModal,
} from '../../../income';

import {
  TabsAllocations ,
  usePersistAllocationModal,
} from '../../../allocation';

type AccountDetailPageProps = {
  identifier: string;
}

export default function AccountDetailPage({ identifier }: AccountDetailPageProps) {
  const { t } = useAppTranslation();
  const { data , filters, inputFilters, clearInputFilters, applyInputFilters } = useDetail<TAccount, TAccountFilter>({
    identifier,
    fetchDetail: financeBffService.account.detail,
    initialFilters: accountBusiness.INITIAL_FILTERS,
    initialInputFilters: accountBusiness.INITIAL_INPUT_FILTERS.filter((item) => item.name === 'reference_year'),
  });

  const { items: categories, fetchList: fetchCategory } = useCategory();

  const referenceYear = useMemo(() => {
    if (filters?.reference_year) {
      return filters.reference_year;
    }
    return accountBusiness.INITIAL_FILTERS.reference_year ?? new Date().getFullYear();
  }, [filters]);

  const { openPersist: openCreateIncome, modal: incomeModal } = usePersistIncomeModal({
    incomes: data?.incomes ?? [],
    account: data,
  });
  
  const { openPersist: openCreateAllocation, modal: allocationModal } = usePersistAllocationModal({
    allocations: data?.allocations ?? [],
    account: data,
  });

  const hasIncomes = useMemo(() => {
    return data?.incomes && data.incomes.length > 0;
  }, [data]);

  const hasAllocations = useMemo(() => {
    return data?.allocations && data.allocations.length > 0;
  }, [data]);

  useEffect(() => {
    void fetchCategory();
  } ,[]);

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-6 text-slate-950 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full flex-col gap-4">
        <div className="flex justify-between">
          <Text>{data?.name}</Text>
          <Dropdown
            align="right"
            items={[
              {
                label: t('income.create.title'),
                icon: <MdTrendingUp size={16} />,
                iconPosition: 'left',
                onClick: () => openCreateIncome(),
              },
              {
                label: t('allocation.create.title'),
                icon: <MdPieChart size={16} />,
                iconPosition: 'left',
                onClick: () => openCreateAllocation(),
              },
            ]}
          />
        </div>

        { inputFilters && inputFilters.length > 0 && (
          <Filters
            filters={ inputFilters }
            ariaLabel={ t('account.list.filtersAria') }
            onApply={ (filters) => applyInputFilters?.(filters as TAccountFilter) }
            onClear={ clearInputFilters }
          />
        ) }

        {data && (
          <section className="flex flex-col gap-10 rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-sm sm:p-5">

            { (!hasIncomes && !hasAllocations) &&
              (
                <div className="flex h-full w-full items-center justify-center p-4">
                  <Text className="text-slate-600">{t('common.noDataFound')}</Text>
                </div>
              )
            }

            {hasIncomes && (
              <IncomeList
                incomes={data.incomes}
                referenceYear={referenceYear}
                onPersist={openCreateIncome}
              />
            )}
            {hasAllocations && (
              <TabsAllocations allocations={data.allocations} referenceYear={referenceYear} categories={categories}/>
            )}
          </section>
        )}
      </div>

      {incomeModal}
      {allocationModal}
    </main>
  );
}