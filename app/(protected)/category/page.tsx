'use client';
import { useAppTranslation } from '@/app/shared';
import { FiltersProps ,Table ,useAlert ,useModal } from '@/app/ds';
import { useMemo } from 'react';
import { TCategory ,TCategoryFilter } from '@/app/modules';
import { categoryBusiness ,PersistCategory } from '@/app/modules/finance';
import { useRouter } from 'next/navigation';


import { usePaginatedList } from '@/app/ui';
import PaginatedList from '../../ui/paginated-list/PaginatedList';

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
      type: 'text' ,
      value: '' ,
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
  const handleDelete = (id: string) => {
    showAlert({
      type: 'warning',
      message: `Ação de excluir categoria ${id} ainda não implementada.`,
    });
  };

  const handlePersistModal = (item?: TCategory) => {
    const handleReload = () => {
      clearInputFilters();
      void reload();
      closeModal();
    };
    openModal({
      title: item ? t('category.edit.title', { name: item.name }) : t('category.create.title'),
      body: <PersistCategory category={item} onClose={handleReload} />,
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
            value: 'id' ,
            label: 'ID' ,
            align: 'left'
          } ,
          {
            value: 'name' ,
            label: 'Name' ,
            align: 'left' ,
            sortable: true ,
          },
          {
            value: 'type' ,
            label: 'Type' ,
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
            onClick: (item) => handleDelete((item as TCategory).id) ,
          } ,
        }}
      />
    </PaginatedList>
  );
}