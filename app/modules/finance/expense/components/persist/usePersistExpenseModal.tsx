'use client';
import React from 'react';

import { useAppTranslation } from '@/app/shared';
import { useAlert, useModal } from '@/app/ds';
import { ActionState } from '@/app/modules/actions';

import type { TCategory } from '../../../category';
import type { TAllocation } from '../../../allocation';

import { expenseBusiness } from '../../business';

import type { TExpense } from '../../types';

import PersistExpense from './PersistExpense';

type UsePersistIncomeModalParams = {
  expenses: Array<TExpense>;
  categories: Array<TCategory>;
  allocation?: TAllocation;
};

export function usePersistExpenseModal({ expenses, allocation, categories }: UsePersistIncomeModalParams) {
  const { t } = useAppTranslation();
  const { openModal, modal, closeModal } = useModal();
  const { showAlert } = useAlert();

  const handleClose = (actionState: ActionState) => {
    if (actionState.status !== 'cancel') {
      const message = expenseBusiness.getResponseMessage(actionState);
      showAlert({
        type: actionState.status === 'success' ? 'success' : 'error',
        message: t(message),
      });
    }
    closeModal();
  };

  const openPersist = (item?: unknown, disabled?: boolean) => {
    if (!allocation) return;
    const expense = expenseBusiness.getOriginal(expenses ?? [], item);
    openModal({
      title: expense
        ? t('expense.edit.title', { name: expense.payee })
        : t('expense.create.title'),
      body: (
        <PersistExpense
          expense={expense}
          onClose={handleClose}
          categories={categories}
          allocation={allocation}
          disabled={disabled}
        />
      ),
    });
  };

  return { openPersist, modal };
}
