'use client';

import type { TCategory ,TCategoryType } from '../../types';
import React ,{ useActionState ,useEffect } from 'react';

import { persistCategoryAction } from '@/app/actions/category';
import { INITIAL_ACTION_STATE } from '@/app/actions/state';
import { translateI18nMessage ,useAppTranslation } from '@/app/shared';
import { Button ,Card ,Input ,Text } from '@/app/ds';

type PersistCategoryProps = {
  category?: TCategory;
  onClose: (type?: 'submitted' | 'canceled') => void;
}

type DraftCategory = {
  name: string;
  type: TCategoryType | '';
  description: string;
}

const CATEGORY_TYPES: Array<TCategoryType> = [
  'FOOD',
  'OTHER',
  'STUDIES',
  'UTILITY',
  'HEALTH',
  'PERSONAL',
  'TRANSPORT',
  'ENTERTAINMENT',
  'GOVERNMENT_FEES',
];

const initDraftCategory = (category?: TCategory): DraftCategory => {
  return {
    name: category?.name || '',
    type: category?.type || '',
    description: category?.description || '',
  };
};


export default function PersistCategory({ category, onClose }: PersistCategoryProps) {
  const [state, formAction, isPending] = useActionState(persistCategoryAction, { ...INITIAL_ACTION_STATE, item: category });
  const [draftCategory, setDraftCategory] = React.useState<DraftCategory>(initDraftCategory(category));
  const { t } = useAppTranslation();
  
  const updateDraftValue = <K extends keyof DraftCategory>(key: K, value: DraftCategory[K]) => {
    setDraftCategory((previousState) => ({
      ...previousState,
      [key]: value,
    }));
  };
  
  useEffect(() => {
    if (state.status === 'success') {
      onClose('submitted');
    }
  } ,[onClose, state]);

  return (
    <div>
      <form action={formAction} className="flex flex-col gap-4">
        <Text as="p" size="sm" color="text-slate-600">
          {t('category.form.subtitle')}
        </Text>
        <Input
          id="name"
          label={t('form.nameLabel')}
          name="name"
          type="text"
          value={draftCategory.name}
          required
          onValueChange={(nextValue) => updateDraftValue('name', nextValue)}
          placeholder={t('form.namePlaceholder')}
        />

        <fieldset className="flex flex-col gap-2">
          <Text as="legend" size="xs" color="text-slate-600" weight="semibold" tracking="wide" className="uppercase">
            {t('form.typeLabel')}
          </Text>
          <Text as="p" size="xs" color="text-slate-500">
            {t('category.form.typeHelper')}
          </Text>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {CATEGORY_TYPES.map((type) => {
              const isSelected = draftCategory.type === type;

              return (
                <label
                  key={type}
                  className={`flex cursor-pointer items-center gap-2 rounded-xl border px-3 py-2 text-sm transition-colors ${isSelected
                    ? 'border-blue-300 bg-blue-50 text-blue-700'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'}`}
                >
                  <input
                    type="radio"
                    name="type"
                    value={type}
                    checked={isSelected}
                    required
                    onChange={() => updateDraftValue('type', type)}
                    className="h-4 w-4 accent-blue-600"
                  />
                  <span>{t(`category.types.${type}`)}</span>
                </label>
              );
            })}
          </div>
        </fieldset>

        <Input
          id="description"
          label={t('form.descriptionLabel')}
          name="description"
          type="text"
          value={draftCategory.description}
          required
          onValueChange={(nextValue) => updateDraftValue('description', nextValue)}
          placeholder={t('form.descriptionPlaceholder')}
        />

        {state.status === 'error' && (
          <Card variant="outlined" rounded="lg" className="border-red-200 bg-red-50 p-3">
            <Text size="sm" color="text-red-700">
              {translateI18nMessage(t, state.message)}
            </Text>
          </Card>
        )}

        <div className="flex items-center justify-end gap-2 pt-2">
          <Button
            type="button"
            appearance="outline"
            tone="neutral"
            onClick={() => onClose('canceled')}
            disabled={isPending}
          >
            {t('form.cancel')}
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending ? t('form.submitting') : category ? t('form.save') : t('form.submit')}
          </Button>
        </div>
      </form>
    </div>
  );
}