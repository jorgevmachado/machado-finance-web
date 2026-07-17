'use client';
import React ,{ useEffect } from 'react';

import {
  ActionState ,createI18nMessage ,
  INITIAL_ACTION_STATE ,mapError ,toErrorState ,translateI18nMessage ,
  useAppTranslation ,
} from '@/app/shared';

import { Button ,Card ,Input ,Text ,useLoading } from '@/app/ds';

import type { TCategory ,TCategoryDraft } from '../../types';
import { categoryBffService } from '../../api';
import { categoryValidator } from '../../validator';


type PersistCategoryProps = {
  onClose: (actionState: ActionState) => void;
  category?: TCategory;
  disabled?: boolean;
}

export default function PersistCategory({
  category ,
  onClose ,
  disabled = false,
}: PersistCategoryProps) {
  const { t } = useAppTranslation();
  const { startContentLoading, stopContentLoading } = useLoading();
  const [state ,setState] = React.useState<ActionState>(INITIAL_ACTION_STATE);
  const [isPending ,setIsPending] = React.useState(false);
  const [draftCategory ,setDraftCategory] = React.useState<TCategoryDraft>({
    name: category?.name || '',
    description: category?.description || '',
  });

  const updateDraftValue = <K extends keyof TCategoryDraft>(key: K ,value: TCategoryDraft[K]) => {
    setDraftCategory((previousState) => ({
      ...previousState ,
      [key]: value ,
    }));
  };

  const handleCreate = async () => {
    startContentLoading();

    try {
      const response = await categoryBffService.create(draftCategory);

      if (response.error) {
        setState(toErrorState(response.message, 'create'));
        setIsPending(false);
        return;
      }
    } catch (error) {
      setState(mapError(error ,'category.messages.error.create'));
      setIsPending(false);
      return;
    } finally {
      stopContentLoading();
    }

    setState({
      type: 'create' ,
      status: 'success' ,
      message: 'category.messages.success.create' ,
    });
    setIsPending(false);
    stopContentLoading();

  };

  const handleUpdate = async (category: TCategory) => {
    startContentLoading();
    if (categoryValidator.hasEntityChanged(category ,draftCategory)) {
      try {
        const response = await categoryBffService.update(category.id, draftCategory);

        if (response.error) {
          setState(toErrorState(response.message, 'update'));
          setIsPending(false);
          return;
        }
      } catch (error) {
        setState(mapError(error ,'category.messages.error.update'));
        setIsPending(false);
        return;
      } finally {
        stopContentLoading();
      }
    }

    setState({
      type: 'update' ,
      status: 'success' ,
      message: 'category.messages.success.update' ,
    });
    setIsPending(false);
    stopContentLoading();
  };
  
  const handleSubmit = async (event: React.SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (disabled) {
      return;
    }

    setIsPending(true);

    if (!category) {
      await handleCreate();
      return;
    }

    await handleUpdate(category);
  };

  useEffect(() => {
    if (state.status !== 'idle') {
      onClose(
        { type: state.type ,status: state.status ,message: state.message });
      return;
    }
  } ,[onClose ,state]);

  return (
    <div>
      <form onSubmit={ (event) => handleSubmit(event) } className="flex flex-col gap-4">
        { !disabled && (
          <Text as="p" size="sm" color="text-slate-600">
            { t('category.form.subtitle') }
          </Text>
        ) }
        <Input
          id="name"
          label={ t('form.nameLabel') }
          name="name"
          type="text"
          value={ draftCategory.name }
          required
          disabled={ disabled }
          onValueChange={ (nextValue) => updateDraftValue('name' ,nextValue) }
          placeholder={ t('form.namePlaceholder') }
        />

        <label className="flex flex-col gap-1.5">
          <Text
            size="xs"
            color="text-slate-600"
            weight="semibold"
            tracking="wide"
            className="uppercase"
          >
            {t('form.descriptionLabel')}
          </Text>
          <textarea
            id="description"
            name="description"
            value={draftCategory.description}
            required
            disabled={disabled}
            rows={4}
            className="w-full resize-none rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400"
            onChange={(event) => updateDraftValue('description', event.target.value)}
            placeholder={t('form.descriptionPlaceholder')}
          />
        </label>

        { state.status === 'error' && (
          <Card variant="outlined" rounded="lg" className="border-red-200 bg-red-50 p-3">
            <Text size="sm" color="text-red-700">
              { translateI18nMessage(t ,state.message) }
            </Text>
          </Card>
        ) }

        <div className="flex items-center justify-end gap-2 pt-2">
          {
            disabled ? (
              <Button
                type="button"
                appearance="outline"
                tone="neutral"
                onClick={ () => onClose({
                  status: 'cancel' ,
                  type: state.type ,
                  message: state.message,
                }) }
                disabled={ isPending }
              >
                { t('form.close') }
              </Button>
            ) : (
              <>
                <Button
                  type="button"
                  appearance="outline"
                  tone="neutral"
                  onClick={ () => onClose({
                    status: 'cancel' ,
                    type: state.type ,
                    message: state.message,
                  }) }
                  disabled={ isPending }
                >
                  { t('form.cancel') }
                </Button>
                <Button type="submit" disabled={ isPending }>
                  { isPending ?
                    t('form.submitting') :
                    category ? t('form.save') : t('form.submit') }
                </Button>
              </>
            )
          }

        </div>
      </form>
    </div>
  );
}