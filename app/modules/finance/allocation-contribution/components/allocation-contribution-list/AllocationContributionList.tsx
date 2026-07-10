'use client';
import React ,{ useMemo } from 'react';

import { useAppTranslation } from '@/app/shared';

import { Table } from '@/app/ds';

import { movementBusiness } from '../../../movement';

import type { TAllocationContribution } from '../../types';


type AllocationContributionListProps = {
  referenceYear: number;
  onPersist: (item?: unknown, disabled?: boolean) => void;
  allocationContributions: Array<TAllocationContribution>;
}

export default function AllocationContributionList({ allocationContributions, referenceYear, onPersist }: AllocationContributionListProps) {
  const { t } = useAppTranslation();

  const textTree = useMemo(() => {
    return [
      { value: 'contributor_name', label: 'allocation-contribution.contributor_name' },
      { value: 'total', label: 'common.total' },
    ];
  }, []);

  const allocationContributionsTable = useMemo(() => {
    return movementBusiness.generateMovementTable({
      entities: allocationContributions,
      sortable: true,
      referenceYear,
      chooseValues: textTree.map((item) => item.value),
    });
  }, [allocationContributions, referenceYear, textTree]);

  const translatedHeaders = useMemo(() => {
    return allocationContributionsTable.headers.map((header) => {
      const translatedLabel = textTree.find((item) => item.value === header.value)?.label || header.label;
      const currentFooter  = textTree.find((item) => item.value === header.footer)?.label;
      const translatedFooter = currentFooter ? t(currentFooter.toString()) : header.footer;
      
      return {
        ...header,
        label: t(translatedLabel),
        footer: translatedFooter
      };
    });
  }, [allocationContributionsTable.headers, t, textTree]);

  return (
    <div className="flex w-full flex-col gap-6">
      <div className="w-full overflow-x-auto">
        <Table
          items={allocationContributionsTable.body}
          headers={translatedHeaders}
          withFooter={true}
          onRowClick={(item) => onPersist(item)}
          showNotFoundError={true}
        />
      </div>
    </div>
  );
}
