'use client';
import React from 'react';

import { useAppTranslation } from '@/app/shared';
import { useAlert, useModal } from '@/app/ds';
import { ActionState } from '@/app/modules/actions';

import type { TCategory } from '../../../category';
import type { TAllocation } from '../../../allocation';

import { expenseBusiness } from '../../business';

import type { TExpense, TExpenseUploadResponse } from '../../types';

import PersistExpense from './PersistExpense';
import { ExpenseUpload, PersistExpenseUpload } from './upload';

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

  const handleOpenPersistUpload = (actionState: ActionState, response?: TExpenseUploadResponse) => {
    if (actionState.status === 'cancel') {
      closeModal();
      return;
    }
    if (actionState.status === 'error') {
      const message = expenseBusiness.getResponseMessage(actionState);
      showAlert({
        type: 'error',
        message: t(message),
      });
      return;
    }
    if (actionState.status === 'success' && response) {
      closeModal();
      openPersistUpload(response);
    }
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
  
  const openPersistUpload = (response: TExpenseUploadResponse) => {
    openModal({
      width: '3xl',
      title: t('expense.upload.persist.title'),
      body: (<PersistExpenseUpload response={response} categories={categories} onClose={handleClose} />),
    });
  };
  
  const openUpload = () => {
    if (!allocation) return;
    openModal({
      title: t('expense.upload.title'),
      body: (
        <ExpenseUpload
          onClose={(state, response) => handleOpenPersistUpload(state, response)}
          allocation={allocation}
        />
      ),
    });
  };

  return { openPersist, openUpload,  modal };
}
