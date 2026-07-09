import type { TAllocation } from '../../types';
import React ,{ useMemo } from 'react';

import { useAppTranslation } from '@/app/shared';

import { Dropdown ,Tabs ,Text } from '@/app/ds';

import { AllocationDetail } from '../allocation-detail';
import { MdPieChart ,MdTrendingUp } from 'react-icons/md';

type TabsAllocationsProps = {
  allocations: Array<TAllocation>;
  referenceYear: number;
}

export default function TabsAllocations({ allocations, referenceYear }: TabsAllocationsProps) {
  const { t } = useAppTranslation();

  const tabAllocations = useMemo(() => {
    if (!allocations || allocations?.length === 0) {
      return [];
    }

    return allocations.map((allocation) => ({
      id: allocation.id,
      title: allocation.name,
      children: <AllocationDetail allocation={allocation} referenceYear={referenceYear}/>,
    }));
  }, [allocations, referenceYear]);
  
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
        <div className="flex justify-end">
          <Dropdown
            align="right"
            items={[
              {
                label: t('expense.create.title'),
                icon: <MdTrendingUp size={16} />,
                iconPosition: 'left',
                onClick: () => console.log('# => Open Create Expenses'),
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