'use client';
import { DeleteEntity ,usePaginatedList } from '@/app/ui';
import {
  categoryBusiness ,
  financeBffService ,
  TCategory ,
  TCategoryFilter ,
} from '@/app/modules/finance';
import { ActionState } from '@/app/modules/actions';
import { ETypeTableHeader ,Table ,useAlert ,useModal } from '@/app/ds';
import { useAppTranslation } from '@/app/shared';

import { PersistCategory } from '../../components';

import PaginatedList from '../../../../../ui/paginated-list/PaginatedList';

export default function CategoryListPage() {

  const {
    meta,
    items,
    goToPage,
    reload,
    isLoading,
    inputFilters,
    clearInputFilters,
    applyInputFilters,
  } = usePaginatedList<TCategory, TCategoryFilter>({
    initialFilters: categoryBusiness.INITIAL_FILTERS,
    initialInputFilters: categoryBusiness.INITIAL_INPUT_FILTERS,
    normalizeFilters: categoryBusiness.normalizeFilters,
    fetchPaginatedList: financeBffService.category.list_paginate
  });
  const { t } = useAppTranslation();
  const { showAlert } = useAlert();
  const { openModal ,modal ,closeModal } = useModal();

  const handleCloseModal = (actionState: ActionState) => {
    if (actionState.status !== 'cancel') {
      const message = categoryBusiness.getResponseMessage(actionState);
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
    const category = categoryBusiness.getOriginal(items ?? [], item);
    openModal({
      title: category ? t('category.edit.title', { name: category.name }) : t('category.create.title'),
      body: <PersistCategory category={category} onClose={handleCloseModal} disabled={disabled} />,
    });
  };

  const handleDeleteModal = (id: string) => {
    openModal({
      title: t('category.delete.title'),
      body: <DeleteEntity identifier={id} onClose={handleCloseModal} fetchDelete={financeBffService.category.delete} />,
    });
  };

  return (
    <PaginatedList
      meta={meta}
      domain="category"
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
      <Table
        items={items}
        headers={[
          {
            value: 'name' ,
            label: t('filters.name') ,
            align: 'left' ,
            sortable: true ,
          },
          {
            value: 'created_at' ,
            type: ETypeTableHeader.DATE ,
            label: t('filters.createdAt') ,
            align: 'left' ,
            sortable: true ,
          },
        ]}
        actions={{
          text: t('common.actions'),
          align: 'center',
          show: {
            label: 'Show' ,
            onClick: (item) =>  handlePersistModal(item, true) ,
          } ,
          edit: {
            label: 'Edit' ,
            onClick: handlePersistModal ,
          } ,
          delete: {
            label: 'Delete' ,
            onClick: (item) => handleDeleteModal((item as TCategory).id) ,
          } ,
        }}
      />
    </PaginatedList>
  );
}