'use client';
import { useCallback ,useMemo } from 'react';
import { ActionState ,useAppTranslation } from '@/app/shared';

import { ETypeTableHeader ,Table ,useAlert ,useModal } from '@/app/ds';

import { DeleteEntity ,PaginatedList ,usePaginatedList } from '@/app/ui';

import type { TCategory, TCategoryFilter } from '../../types';
import { categoryBffService } from '../../api';
import { PersistCategory } from '../../components';


export default function CategoryListPage() {
  const { t } = useAppTranslation();
  const { showAlert } = useAlert();
  const { openModal ,modal ,closeModal } = useModal();
  const initialFilters = useMemo<TCategoryFilter>(() => ({ name: undefined }), []);
  const initialInputFilters = useMemo(() => ([{
    name: 'name',
    label: 'filters.label.name',
    type: 'text' as const,
    value: '',
    placeholder: 'filters.placeholder.name',
  }]), []);
  const normalizeFilters = useCallback((filters?: TCategoryFilter) => {
    return { name: filters?.name?.trim() || undefined };
  }, []);
  const fetchPaginatedList = useCallback((params: { page: number; filters: TCategoryFilter; perPage?: number }) => {
    return categoryBffService.listPaginate(params);
  }, []);

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
    initialFilters,
    initialInputFilters,
    normalizeFilters,
    fetchPaginatedList
  });

  const handleCloseModal = (actionState: ActionState) => {
    if (actionState.status !== 'cancel') {
      showAlert({
        type: actionState.status === 'success' ? 'success' : 'error',
        message: t(actionState.message)
      });
      clearInputFilters();
      void reload();
    }
    closeModal();
  };

  const handlePersistModal = (item?: unknown, disabled?: boolean) => {
    const itemId = (item as TCategory)?.id;
    const category = items?.find((item) => item.id === itemId);
    openModal({
      title: category ? t('category.edit.title', { name: category.name }) : t('category.create.title'),
      body: <PersistCategory category={category} onClose={handleCloseModal} disabled={disabled} />,
    });
  };

  const handleDeleteModal = (item: unknown) => {
    const itemId = (item as TCategory)?.id;
    openModal({
      title: t('category.delete.title'),
      body: <DeleteEntity identifier={itemId} onClose={handleCloseModal} fetchDelete={(identifier) => categoryBffService.delete(identifier)} />,
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
            onClick: handleDeleteModal ,
          } ,
        }}
      />
    </PaginatedList>
  );
}