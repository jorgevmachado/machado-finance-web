'use client';
import React from 'react';

import { useAppTranslation } from '@/app/shared';
import { useAlert, useModal } from '@/app/ds';
import { ActionState } from '@/app/modules/actions';

import type { TAllocation } from '../../../allocation';

import { allocationContributionBusiness } from '../../business';

import type { TAllocationContribution } from '../../types';

import PersistAllocationContribution from './PersistAllocationContribution';

type UsePersistIncomeModalParams = {
  allocation?: TAllocation;
  allocationContributions: Array<TAllocationContribution>;
};

export function usePersistAllocationContributionModal({ allocation, allocationContributions }: UsePersistIncomeModalParams) {
  const { t } = useAppTranslation();
  const { openModal, modal, closeModal } = useModal();
  const { showAlert } = useAlert();

  const handleClose = (actionState: ActionState) => {
    if (actionState.status !== 'cancel') {
      const message = allocationContributionBusiness.getResponseMessage(actionState);
      showAlert({
        type: actionState.status === 'success' ? 'success' : 'error',
        message: t(message),
      });
    }
    closeModal();
  };

  const openPersist = (item?: unknown, disabled?: boolean) => {
    if (!allocation) return;
    const allocationContribution = allocationContributionBusiness.getOriginal(allocationContributions ?? [], item);
    openModal({
      title: allocationContribution
        ? t('allocation-contribution.edit.title', { name: allocationContribution.contributor_name })
        : t('allocation-contribution.create.title'),
      body: (
        <PersistAllocationContribution
          onClose={handleClose}
          disabled={disabled}
          allocation={allocation}
          allocationContribution={allocationContribution}
        />
      ),
    });
  };

  return { openPersist, modal };
}
