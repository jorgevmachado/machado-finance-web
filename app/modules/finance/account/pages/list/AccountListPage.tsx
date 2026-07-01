'use client';
import { useAppTranslation } from '@/app/shared';
import { useAlert ,useModal } from '@/app/ds';
import { PaginatedList ,usePaginatedList } from '@/app/ui';

import { ActionState } from '@/app/modules/actions';
import { financeBffService } from '@/app/modules/finance';

import type { TAccount , TAccountFilter } from '../../types';
import { accountBusiness } from '../../business';

import { PersistAccount } from '../../components';



export default function AccountListPage() {
  const { t } = useAppTranslation();
  const { showAlert } = useAlert();
  const { openModal ,modal ,closeModal } = useModal();
  const {
    meta,
    items,
    goToPage,
    reload,
    isLoading,
    inputFilters,
    clearInputFilters,
    applyInputFilters,
  } = usePaginatedList<TAccount, TAccountFilter>({
    initialFilters: accountBusiness.INITIAL_FILTERS,
    initialInputFilters: accountBusiness.INITIAL_INPUT_FILTERS,
    normalizeFilters: accountBusiness.normalizeFilters,
    fetchPaginatedList: financeBffService.account.list_paginate
  });

  const handleCloseModal = (actionState: ActionState) => {
    if (actionState.status !== 'cancel') {
      const message = accountBusiness.getResponseMessage(actionState);
      showAlert({
        type: actionState.status === 'success' ? 'success' : 'error',
        message: t(message)
      });
      clearInputFilters();
      void reload();
    }
    closeModal();
  };

  const handlePersistModal = (item?: unknown, disabled?: boolean) => {
    const account = accountBusiness.getOriginalAccount(items ?? [], item);
    openModal({
      title: account ? t('category.edit.title', { name: account.name }) : t('account.create.title'),
      body: <PersistAccount account={account} onClose={handleCloseModal} disabled={disabled} />,
    });
  };
  
  return (
    <PaginatedList
      meta={meta}
      domain="account"
      action={{
        label: t('form.create'),
        onClick: () => handlePersistModal() ,
      }}
      goToPage={goToPage}
      isLoading={isLoading}
      totalItems={items?.length}
      inputFilters={inputFilters}
      clearInputFilters={clearInputFilters}
      applyInputFilters={applyInputFilters}>
      {modal}
      <h1>Account</h1>
    </PaginatedList>
  );
}