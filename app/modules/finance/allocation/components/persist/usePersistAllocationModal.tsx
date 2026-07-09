'use client';
import React from 'react';
import { useAppTranslation } from '@/app/shared';
import { useAlert ,useModal } from '@/app/ds';

import { ActionState } from '@/app/modules/actions';

import type { TAccount } from '../../../account';

import { allocationBusiness } from '../../business';

import type { TAllocation } from '../../types';

import PersistAllocation from './PersistAllocation';


type UserPersistAllocationModalParams = {
  account?: TAccount;
  allocations: Array<TAllocation>;

}
export function usePersistAllocationModal({
  account,
  allocations
}: UserPersistAllocationModalParams) {
  const { t } = useAppTranslation();
  const { openModal, modal, closeModal } = useModal();
  const { showAlert } = useAlert();

  const handleClose = (actionState: ActionState) => {
    if (actionState.status !== 'cancel') {
      const message = allocationBusiness.getResponseMessage(actionState);
      showAlert({
        type: actionState.status === 'success' ? 'success' : 'error',
        message: t(message),
      });
    }
    closeModal();
  };

  const openPersist = (item?: unknown, disabled?: boolean) => {
    if (!account) return;
    const allocation = allocationBusiness.getOriginal(allocations ?? [], item);
    openModal({
      title: allocation
        ? t('allocation.edit.title', { name: allocation.name })
        : t('allocation.create.title'),
      body: (
        <PersistAllocation
          account={account}
          onClose={handleClose}
          allocation={allocation}
          disabled={disabled}
        />
      ),
    });
  };

  return { openPersist, modal };
}