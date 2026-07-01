'use client';
import React ,{ memo, useMemo, useState } from 'react';

import { joinClass } from '@/app/utils';
import { useAppTranslation } from '@/app/shared';
import { Autocomplete ,Button ,Input ,Text } from '@/app/ds';

import type { FiltersProps } from './types';

const Filters = ({
  filters,
  onApply,
  onClear,
  ariaLabel,
  filterApplyLabel = 'Apply filters',
  filterCleanLabel = 'Clear filters',
}: FiltersProps) => {
  const { t } = useAppTranslation();
  const initDraftFilters = (nextFilters: FiltersProps['filters']): Record<string, string> => {
    const result = {} as Record<string, string>;

    for (const filter of nextFilters) {
      result[filter.name] = String(filter.value ?? '');
    }

    return result;
  };

  const [draftFilters, setDraftFilters] = useState<Record<string, string>>(
    () => initDraftFilters(filters),
  );

  const updateDraftValue = (key: string, value: string) => {
    setDraftFilters((previousState) => ({
      ...previousState,
      [key]: value,
    }));
  };

  const handleClear = () => {
    const resetFilters = initDraftFilters(filters);
    setDraftFilters(resetFilters);
    onClear?.();
  };

  const hasActiveFilters = useMemo(() => {
    return Object.values(draftFilters).some((value) => value !== '');
  }, [draftFilters]);

  const handleApply = () => {
    const normalizedFilters = Object.fromEntries(
      Object.entries(draftFilters).map(([key, value]) => [key, value.trim()]),
    ) as Record<string, string>;

    onApply(normalizedFilters);
  };

  return (
    <section
      className="rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-sm sm:p-5"
      aria-label={ariaLabel}
    >
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {filters.map(({ name, label, type, options, isLoading = false, placeholder }) => (
          <label key={name} className={joinClass([
            'flex',
            'flex-col',
            'gap-1.5',
            type === 'autocomplete' && 'relative',
          ])}>
            <Text
              size="xs"
              color="text-slate-600"
              weight="semibold"
              tracking="wide"
              className="uppercase">
              { t(label) }
            </Text>
            { type === 'autocomplete' && options ? (
              <Autocomplete
                name={name}
                value={draftFilters[name]}
                options={options.map((option) => ({ ...option, label: t(option.label ?? '') }))}
                isLoading={isLoading}
                noResultsText={t('filters.noOptions')}
                placeholder={t(placeholder)}
                onValueChange={(nextValue) => {
                  updateDraftValue(name, nextValue);
                }}
              />
            ) : (
              <Input
                type="text"
                value={draftFilters[name]}
                placeholder={t(placeholder)}
                onValueChange={(nextValue) => {
                  updateDraftValue(name, nextValue);
                }}
              />
            ) }

          </label>
        )) }
      </div>

      <div className="mt-4 flex flex-wrap justify-end gap-2">
        <Button
          type="button"
          tone="neutral"
          onClick={handleClear}
          disabled={!hasActiveFilters}
        >
          {filterCleanLabel === 'Clear filters' ? t('filters.clear') : filterCleanLabel}
        </Button>

        <Button
          type="button"
          tone="primary"
          onClick={handleApply}
        >
          {filterApplyLabel === 'Apply filters' ? t('filters.apply') : filterApplyLabel}
        </Button>
      </div>

    </section>
  );
};

export default memo(Filters);
