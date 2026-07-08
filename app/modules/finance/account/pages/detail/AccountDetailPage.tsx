'use client';
import { useDetail } from '@/app/ui';
import {
  AllocationDetail ,
  financeBffService ,IncomeList ,
  TAccount ,
  TAccountFilter ,
} from '@/app/modules/finance';
import { accountBusiness } from '../../business';
import { Filters ,Tabs } from '@/app/ds';
import React ,{ useMemo } from 'react';
import { useAppTranslation } from '@/app/shared';

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

  const referenceYear = useMemo(() => {
    if (filters?.reference_year) {
      return filters.reference_year;
    }
    return accountBusiness.INITIAL_FILTERS.reference_year ?? new Date().getFullYear();
  }, [filters]);

  const tabAllocations = useMemo(() => {
    const allocations = data?.allocations;
    if (!allocations || allocations?.length === 0) {
      return [];
    }

    return allocations.map((allocation) => ({
      id: allocation.id,
      title: allocation.name,
      children: <AllocationDetail allocation={allocation} referenceYear={referenceYear}/>,
    }));
  }, [data, referenceYear]);



  return (
    <main className="min-h-screen bg-slate-50 px-4 py-6 text-slate-950 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        { inputFilters && inputFilters.length > 0 && (
          <Filters
            filters={ inputFilters }
            ariaLabel={ t('account.list.filtersAria') }
            onApply={ (filters) => applyInputFilters?.(filters as TAccountFilter) }
            onClear={ clearInputFilters }
          />
        ) }
      </div>

      {data && (
        <section className="mt-4 flex flex-col gap-10  rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-sm sm:p-5">
          <IncomeList incomes={data.incomes} referenceYear={referenceYear} />
          { tabAllocations && tabAllocations.length > 0 && (
            <Tabs
              items={tabAllocations}
              defaultTabId="overview"
              onChange={(tabId) => console.log('Tab ativa:', tabId)}
            />
          )}
        </section>
      )}

    </main>
  );
}