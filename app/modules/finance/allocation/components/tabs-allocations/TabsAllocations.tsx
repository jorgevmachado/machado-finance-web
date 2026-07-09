import type { TAllocation } from '../../types';
import React ,{ useMemo } from 'react';

import { useAppTranslation } from '@/app/shared';

import { Tabs ,Text } from '@/app/ds';

import type { TCategory } from '../../../category';

import { AllocationDetail } from '../allocation-detail';

type TabsAllocationsProps = {
  categories: Array<TCategory>;
  allocations: Array<TAllocation>;
  referenceYear: number;
}

export default function TabsAllocations({ categories,  allocations, referenceYear }: TabsAllocationsProps) {
  const { t } = useAppTranslation();


  const tabAllocations = useMemo(() => {
    if (!allocations || allocations?.length === 0) {
      return [];
    }

    return allocations.map((allocation) => ({
      id: allocation.id,
      title: allocation.name,
      children: <AllocationDetail categories={categories} allocation={allocation} referenceYear={referenceYear}/>,
    }));
  }, [allocations, categories, referenceYear]);
  
  if (!tabAllocations || tabAllocations.length === 0) {
    return null;
  }


  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Text as="h2" className="text-3xl font-bold text-slate-950 sm:text-4xl">
            { t('allocation.title') } ({ referenceYear })
          </Text>
        </div>
      </div>
      <div className="w-full overflow-x-auto">
        { tabAllocations && tabAllocations.length > 0 && (
          <Tabs
            items={tabAllocations}
            defaultTabId="overview"
            onChange={(tabId) => console.log('Tab ativa:', tabId)}
          />
        )}
      </div>
    </div>
  );
}