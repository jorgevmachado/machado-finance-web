'use client';
import React from 'react';

import { useAppTranslation } from '@/app/shared';
import { useAlert, useModal } from '@/app/ds';
import { ActionState } from '@/app/modules/actions';

import type { TAccount } from '../../../account';

import { incomeBusiness } from '../../business';

import type { TIncome } from '../../types';

import PersistIncome from './PersistIncome';

type UsePersistIncomeModalParams = {
  incomes: Array<TIncome>;
  account?: TAccount;
};

export function usePersistIncomeModal({ incomes, account }: UsePersistIncomeModalParams) {
  const { t } = useAppTranslation();
  const { openModal, modal, closeModal } = useModal();
  const { showAlert } = useAlert();

  const handleClose = (actionState: ActionState) => {
    if (actionState.status !== 'cancel') {
      const message = incomeBusiness.getResponseMessage(actionState);
      showAlert({
        type: actionState.status === 'success' ? 'success' : 'error',
        message: t(message),
      });
    }
    closeModal();
  };

  const openPersist = (item?: unknown, disabled?: boolean) => {
    if (!account) return;
    const income = incomeBusiness.getOriginal(incomes ?? [], item);
    openModal({
      title: income
        ? t('income.edit.title', { name: income.source })
        : t('income.create.title'),
      body: (
        <PersistIncome
          income={income}
          account={account}
          onClose={handleClose}
          disabled={disabled}
        />
      ),
    });
  };

  return { openPersist, modal };
}
