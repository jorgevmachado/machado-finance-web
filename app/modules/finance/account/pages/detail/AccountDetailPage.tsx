'use client';
import { useDetail } from '@/app/ui';
import {
  financeBffService ,
  TAccount ,
  TAccountFilter,
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
  const { data , inputFilters, clearInputFilters, applyInputFilters } = useDetail<TAccount, TAccountFilter>({
    identifier,
    fetchDetail: financeBffService.account.detail,
    initialFilters: { year: new Date().getFullYear() },
    initialInputFilters: accountBusiness.INITIAL_INPUT_FILTERS.filter((item) => item.name === 'year'),
  });

  const tabAllocations = useMemo(() => {
    if (!data) {
      return [];
    }
    const allocations = data.allocations;
    return allocations.map((allocation) => ({
      id: allocation.id,
      title: allocation.name,
      children: <p>{allocation.id}</p>,
    }));
  }, [data]);



  return (
    <main className="min-h-screen bg-slate-50 px-4 py-6 text-slate-950 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 mb-4">
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
        <Tabs
          items={tabAllocations}
          defaultTabId="overview"
          onChange={(tabId) => console.log('Tab ativa:', tabId)}
        />
      )}

    </main>
  );
}