'use client';
import React ,{ useEffect } from 'react';

import {
  createI18nMessage ,
  translateI18nMessage ,
  useAppTranslation,
} from '@/app/shared';
import { Button ,Card ,Input, Text ,useLoading } from '@/app/ds';

import {
  ActionState ,
  INITIAL_ACTION_STATE ,mapError ,
  toErrorState ,
} from '@/app/modules/actions';


import type { TAccount } from '../../../account';
import type { TAllocation ,  TAllocationCreate, TAllocationUpdate, TDraftAllocation } from '../../types';
import { allocationBusiness } from '../../business';

import {
  ALLOCATION_DEFAULT_CREATE_ERROR_MESSAGE ,ALLOCATION_DEFAULT_UPDATE_ERROR_MESSAGE ,
  validateCreatePayload ,validateUpdatePayload ,
} from '../../validation';
import { financeBffService } from '@/app/modules/finance';
import { isObjectEmpty } from '@/app/utils';

type PersistAllocationProps = {
  account: TAccount;
  allocation?: TAllocation;
  onClose: (actionState: ActionState) => void;
  disabled?: boolean;
}

export default function PersistAllocation({ account, allocation, onClose, disabled }: PersistAllocationProps) {
  const { t } = useAppTranslation();
  const { startContentLoading, stopContentLoading } = useLoading();
  const [state ,setState] = React.useState<ActionState>(INITIAL_ACTION_STATE);
  const [isPending ,setIsPending] = React.useState(false);
  const [draftAllocation ,setDraftAllocation] = React.useState<TDraftAllocation>(allocationBusiness.initDraft(allocation));

  const updateDraftValue = <K extends keyof TDraftAllocation>(key: K ,value: TDraftAllocation[K]) => {
    setDraftAllocation((previousState) => ({
      ...previousState ,
      [key]: value ,
    }));
  };

  const handleCreate = async () => {
    startContentLoading();
    const payload: TAllocationCreate = {
      name: draftAllocation.name ,
      account_id: account.id ,
      description: draftAllocation.description ,
    };
    const validationError = validateCreatePayload(payload);

    if (validationError) {
      setState(validationError);
      setIsPending(false);
      return;
    }

    try {
      const response = await financeBffService.allocation.create({ payload });

      if (response.error) {
        setState(toErrorState(response.i18nMessageError || response.message || ALLOCATION_DEFAULT_CREATE_ERROR_MESSAGE ,'create'));
        setIsPending(false);
        return;
      }
    } catch (error) {
      setState(mapError(error ,ALLOCATION_DEFAULT_CREATE_ERROR_MESSAGE));
      setIsPending(false);
      return;
    } finally {
      stopContentLoading();
    }

    setState({
      type: 'create' ,
      status: 'success' ,
      message: createI18nMessage('allocation.messages.created') ,
    });
    setIsPending(false);
    stopContentLoading();
  };

  const handleUpdate = async (allocation: TAllocation) => {
    startContentLoading();
    const payload: TAllocationUpdate = {};
    if (draftAllocation.name !== allocation.name) {
      payload.name = draftAllocation.name;
    }
    if (draftAllocation.account_id && draftAllocation.account_id !== allocation.account_id) {
      payload.account_id = draftAllocation.account_id;
    }
    if (draftAllocation.description !== allocation.description) {
      payload.description = draftAllocation.description;
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
          identifier: allocation.id ,
          payload ,
        });

        if (response.error) {
          setState(toErrorState(response.i18nMessageError || response.message || ALLOCATION_DEFAULT_UPDATE_ERROR_MESSAGE ,'update'));
          setIsPending(false);
          return;
        }
      } catch (error) {
        setState(mapError(error ,ALLOCATION_DEFAULT_UPDATE_ERROR_MESSAGE));
        setIsPending(false);
        return;
      } finally {
        stopContentLoading();
      }
    }

    setState({
      type: 'update' ,
      status: 'success' ,
      message: createI18nMessage('allocation.messages.updated') ,
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

    if (!allocation) {
      await handleCreate();
      return;
    }

    await handleUpdate(allocation);
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
            { t('allocation.form.subtitle') }
          </Text>
        ) }
        <Input
          id="name"
          label={ t('form.nameLabel') }
          name="name"
          type="text"
          value={ draftAllocation.name }
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
            value={draftAllocation.description}
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
                    allocation ? t('form.save') : t('form.submit') }
                </Button>
              </>
            )
          }

        </div>
      </form>
    </div>
  );
}