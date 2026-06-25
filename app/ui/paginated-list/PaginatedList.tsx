import React from 'react';

import { Badge ,Button ,Card ,Filters ,Pagination ,Text } from '@/app/ds';

import { useAppTranslation } from '@/app/shared';

import { PaginatedListProps } from './types';

export default function PaginatedList<TItem ,TFilters>({
  meta ,
  title,
  domain ,
  action,
  subtitle,
  goToPage ,
  children ,
  isLoading ,
  totalItems = 0 ,
  inputFilters ,
  clearInputFilters ,
  applyInputFilters,
}: PaginatedListProps<TItem ,TFilters>) {
  const { t } = useAppTranslation();
  return (
    <main
      className="min-h-screen bg-slate-50 px-4 py-6 text-slate-950 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <header className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            { title && (
              <Text as="h1" className="text-3xl font-bold text-slate-950 sm:text-4xl">
                { title }
              </Text>
            )}
            { subtitle && (
              <Text className="mt-1 max-w-2xl text-sm text-slate-600 sm:text-base">
                { subtitle }
              </Text>
            ) }
          </div>
          <div>
            <Badge tone="info" variant="soft" size="lg">
              { t('pagination.recordCount' ,{ count: meta.total }) }
            </Badge>
            { action && (
              <Button type="button" onClick={ () => action.onClick({}) } appearance="solid" tone="primary">
                { action.label }
              </Button>
            )}
          </div>

        </header>
        { inputFilters && inputFilters.length > 0 && (
          <Filters
            filters={ inputFilters }
            ariaLabel={ t(`${ domain }.list.filtersAria`) }
            onApply={ (filters) => applyInputFilters?.(filters as TFilters) }
            onClear={ clearInputFilters }
          />
        ) }

        { !isLoading && totalItems === 0 ? (
          <Card variant="outlined" rounded="lg" className="text-center">
            <Text className="text-slate-600">{ t(
              `${ domain }.list.empty`) }</Text>
          </Card>
        ) : null }

        { children }

        <Pagination
          currentPage={ meta.current_page }
          totalPages={ meta.total_pages }
          onPageChange={ goToPage }
          isLoading={ isLoading }
        />
      </div>
    </main>
  );
}