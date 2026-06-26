'use client';
import { useAppTranslation } from '@/app/shared';
import { FiltersProps ,Table ,useAlert ,useModal } from '@/app/ds';
import { useMemo } from 'react';
import { TCategory ,TCategoryFilter } from '@/app/modules';
import { categoryBusiness ,PersistCategory } from '@/app/modules/finance';
import { useRouter } from 'next/navigation';


import { DeleteEntity ,usePaginatedList } from '@/app/ui';
import PaginatedList from '../../ui/paginated-list/PaginatedList';
import { ActionState } from '@/app/actions/state';
import { CATEGORY_TYPES } from '@/app/modules/finance/category';

export default function CategoryPage() {

  const { t } = useAppTranslation();
  const router = useRouter();
  const { showAlert } = useAlert();
  const { openModal ,modal ,closeModal } = useModal();


  const initialInputFilters = useMemo<FiltersProps['filters']>(() => [
    {
      name: 'name' ,
      label: t('filters.name') ,
      type: 'text' ,
      value: '' ,
      placeholder: 'Category Name' ,
    } ,
    {
      name: 'type' ,
      label: t('filters.type') ,
      type: 'autocomplete' ,
      value: '' ,
      options: CATEGORY_TYPES.map((type) => ({
        key: type,
        value: type,
        label: t(`category.types.${type}`)
      })),
      placeholder: 'Category Type' ,
    } ,
  ] ,[t]);
  
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
    endpoint: '/finance/category',
    initialFilters: categoryBusiness.INITIAL_FILTERS,
    initialInputFilters,
    normalizeFilters: categoryBusiness.normalizeFilters,
  });

  const handleView = (id: string) => router.push(`/category/${id}`);

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

  const handlePersistModal = (item?: TCategory) => {
    openModal({
      title: item ? t('category.edit.title', { name: item.name }) : t('category.create.title'),
      body: <PersistCategory category={item} onClose={handleCloseModal} />,
    });
  };
  
  const handleDeleteModal = (id: string) => {
    openModal({
      title: t('category.delete.title'),
      body: <DeleteEntity identifier={id} onClose={handleCloseModal} endpoint="/finance/category" />,
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
        items={items?.map((item) => ({
          ...item,
          type: t(`category.types.${item.type}`),
        }))}
        headers={[
          {
            value: 'name' ,
            label: t('filters.name') ,
            align: 'left' ,
            sortable: true ,
          },
          {
            value: 'type' ,
            label: t('filters.type') ,
            align: 'left' ,
            sortable: true ,
          }
        ]}
        actions={{
          align: 'center',
          show: {
            label: 'Show' ,
            onClick: (item) => handleView((item as TCategory).id) ,
          } ,
          edit: {
            label: 'Edit' ,
            onClick: (item) => handlePersistModal((item as TCategory)) ,
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