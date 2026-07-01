'use client';
import React ,{ useEffect } from 'react';

import {
  createI18nMessage ,
  translateI18nMessage ,
  useAppTranslation ,
} from '@/app/shared';

import { isObjectEmpty } from '@/app/utils';

import { Button ,Card ,Input ,Select ,Text ,useLoading } from '@/app/ds';

import {
  ActionState ,
  INITIAL_ACTION_STATE ,
  mapError ,
  toErrorState ,
} from '@/app/modules/actions/state';

import { financeBffService } from '@/app/modules/finance';

import { categoryBusiness } from '../../business';
import type {
  TCategory ,
  TCategoryCreate ,
  TCategoryUpdate ,
  TDraftCategory ,
} from '../../types';

import { ECategoryType } from '../../enum';
import { CATEGORY_TYPES } from '../../constants';
import {
  CATEGORY_DEFAULT_CREATE_ERROR_MESSAGE ,
  CATEGORY_DEFAULT_UPDATE_ERROR_MESSAGE ,
  validateCreatePayload ,
  validateUpdatePayload ,
} from '../../validation';

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
  const { startContentLoading, stopContentLoading } = useLoading();
  const [state ,setState] = React.useState<ActionState>(INITIAL_ACTION_STATE);
  const [isPending ,setIsPending] = React.useState(false);
  const [draftCategory ,setDraftCategory] = React.useState<TDraftCategory>(
    categoryBusiness.initDraftCategory(category));
  const { t } = useAppTranslation();

  const updateDraftValue = <K extends keyof TDraftCategory>(
    key: K ,value: TDraftCategory[K]) => {
    setDraftCategory((previousState) => ({
      ...previousState ,
      [key]: value ,
    }));
  };

  const handleCreate = async () => {
    startContentLoading();
    const payload: TCategoryCreate = {
      name: draftCategory.name ,
      type: draftCategory.type as ECategoryType ,
      description: draftCategory.description ,
    };
    const validationError = validateCreatePayload(payload);

    if (validationError) {
      setState(validationError);
      setIsPending(false);
      return;
    }

    try {
      const response = await financeBffService.category.create({ payload });

      if (response.error) {
        setState(toErrorState(response.i18nMessageError || response.message ||
          CATEGORY_DEFAULT_CREATE_ERROR_MESSAGE ,'create'));
        setIsPending(false);
        return;
      }
    } catch (error) {
      setState(mapError(error ,CATEGORY_DEFAULT_CREATE_ERROR_MESSAGE));
      setIsPending(false);
      return;
    } finally {
      stopContentLoading();
    }

    setState({
      type: 'create' ,
      status: 'success' ,
      message: createI18nMessage('category.messages.created') ,
    });
    setIsPending(false);
    stopContentLoading();
  };

  const handleUpdate = async (category: TCategory) => {
    startContentLoading();
    const payload: TCategoryUpdate = {};
    if (draftCategory.name !== category.name) {
      payload.name = draftCategory.name;
    }
    if (draftCategory.type && draftCategory.type !== category.type) {
      payload.type = draftCategory.type;
    }
    if (draftCategory.description !== category.description) {
      payload.description = draftCategory.description;
    }

    const emptyPayload = isObjectEmpty(payload);
    if (!emptyPayload) {
      const validationError = validateUpdatePayload(payload);
      if (validationError) {
        setState(validationError);
        setIsPending(false);
        return;
      }

      try {
        const response = await financeBffService.category.update({
          identifier: category.id ,
          payload ,
        });

        if (response.error) {
          setState(toErrorState(response.i18nMessageError || response.message ||
            CATEGORY_DEFAULT_UPDATE_ERROR_MESSAGE ,'update'));
          setIsPending(false);
          return;
        }
      } catch (error) {
        setState(mapError(error ,CATEGORY_DEFAULT_UPDATE_ERROR_MESSAGE));
        setIsPending(false);
        return;
      } finally {
        stopContentLoading();
      }
    }

    setState({
      type: 'update' ,
      status: 'success' ,
      message: createI18nMessage('category.messages.updated') ,
    });
    setIsPending(false);
    stopContentLoading();
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
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
      <form onSubmit={ handleSubmit } className="flex flex-col gap-4">
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

        <Select
          label={ t('form.typeLabel') }
          helperText={ !disabled ? t('category.form.typeHelper') : undefined }
          name="type"
          value={ draftCategory.type }
          required
          disabled={ disabled }
          caseSensitive={ false }
          options={ CATEGORY_TYPES.map((type) => ({
            key: type ,
            value: type ,
            label: t(`category.types.${ type }`) ,
          })) }
          onValueChange={ (nextValue) => updateDraftValue('type' ,nextValue) }
        />

        <Input
          id="description"
          label={ t('form.descriptionLabel') }
          name="description"
          type="text"
          value={ draftCategory.description }
          required
          disabled={ disabled }
          onValueChange={ (nextValue) => updateDraftValue('description' ,
            nextValue) }
          placeholder={ t('form.descriptionPlaceholder') }
        />

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