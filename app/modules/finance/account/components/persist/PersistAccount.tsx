import React ,{ useEffect } from 'react';

import {
  createI18nMessage ,
  translateI18nMessage ,
  useAppTranslation,
} from '@/app/shared';
import { Button ,Card ,Input ,Select ,Text ,useLoading } from '@/app/ds';

import {
  ActionState ,
  INITIAL_ACTION_STATE ,mapError ,
  toErrorState ,
} from '@/app/modules/actions';

import { financeBffService } from '@/app/modules/finance';

import type {
  TAccount ,
  TAccountCreate ,
  TAccountUpdate ,
  TDraftAccount,
} from '../../types';
import { accountBusiness  } from '../../business';
import { ACCOUNT_TYPES } from '../../constants';
import {
  validateCreatePayload,
  validateUpdatePayload,
  ACCOUNT_DEFAULT_CREATE_ERROR_MESSAGE,
  ACCOUNT_DEFAULT_UPDATE_ERROR_MESSAGE
} from '../../validation';


import { isObjectEmpty } from '@/app/utils';

type PersistAccountProps = {
  onClose: (actionState: ActionState) => void;
  account?: TAccount;
  disabled?: boolean;
};

export default function PersistAccount({
  onClose,
  account,
  disabled = false,
}: PersistAccountProps) {
  const { startContentLoading, stopContentLoading } = useLoading();
  const { t, locale } = useAppTranslation();
  const [state ,setState] = React.useState<ActionState>(INITIAL_ACTION_STATE);
  const [isPending ,setIsPending] = React.useState(false);
  const [draftAccount ,setDraftAccount] = React.useState<TDraftAccount>(accountBusiness.initDraftAccount(account));

  const updateDraftValue = <K extends keyof TDraftAccount>(key: K ,value: TDraftAccount[K]) => {
    setDraftAccount((previousState) => ({
      ...previousState ,
      [key]: value ,
    }));
  };
  
  
  const handleCreate = async () => {
    startContentLoading();

    const currentInitialBalance = Number(draftAccount.initial_balance);

    const payload: TAccountCreate = {
      name: draftAccount.name ,
      type: draftAccount.type as TAccountCreate['type'] ,
      initial_balance: isNaN(currentInitialBalance) ? 0 : currentInitialBalance ,
    };

    const validationError = validateCreatePayload(payload);

    if (validationError) {
      setState(validationError);
      setIsPending(false);
      return;
    }

    try {
      const response = await financeBffService.account.create({ payload });

      if (response.error) {
        setState(toErrorState(response.i18nMessageError || response.message || ACCOUNT_DEFAULT_CREATE_ERROR_MESSAGE ,'create'));
        setIsPending(false);
        return;
      }
    } catch (error) {
      setState(mapError(error ,ACCOUNT_DEFAULT_CREATE_ERROR_MESSAGE));
      setIsPending(false);
      return;
    } finally {
      stopContentLoading();
    }
    setState({
      type: 'create' ,
      status: 'success' ,
      message: createI18nMessage('account.messages.created') ,
    });
    setIsPending(false);
    stopContentLoading();
  };

  const handleUpdate = async (account: TAccount) => {
    startContentLoading();
    const payload: TAccountUpdate = {};
    if (draftAccount.name !== account.name) {
      payload.name = draftAccount.name;
    }
    if (draftAccount.type && draftAccount.type !== account.type) {
      payload.type = draftAccount.type;
    }
    if (draftAccount.initial_balance !== account.initial_balance) {
      const currentInitialBalance = Number(draftAccount.initial_balance);
      if (!isNaN(currentInitialBalance)) {
        payload.initial_balance = currentInitialBalance;
      }
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
        const response = await financeBffService.account.update({
          identifier: account.id ,
          payload ,
        });

        if (response.error) {
          setState(toErrorState(response.i18nMessageError || response.message || ACCOUNT_DEFAULT_UPDATE_ERROR_MESSAGE ,'update'));
          setIsPending(false);
          return;
        }
      } catch (error) {
        setState(mapError(error ,ACCOUNT_DEFAULT_UPDATE_ERROR_MESSAGE));
        setIsPending(false);
        return;
      } finally {
        stopContentLoading();
      }
    }

    setState({
      type: 'update' ,
      status: 'success' ,
      message: createI18nMessage('account.messages.updated') ,
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

    if (!account) {
      await handleCreate();
      return;
    }

    await handleUpdate(account);
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
            { t('account.form.subtitle') }
          </Text>
        )}
        <Input
          id="name"
          label={ t('form.nameLabel') }
          name="name"
          type="text"
          value={ draftAccount.name }
          required
          disabled={ disabled }
          onValueChange={ (nextValue) => updateDraftValue('name' ,nextValue) }
          placeholder={ t('form.namePlaceholder') }
        />

        <Select
          label={ t('form.typeLabel') }
          helperText={ !disabled ? t('account.form.typeHelper') : undefined }
          name="type"
          value={ draftAccount.type }
          required
          disabled={ disabled }
          caseSensitive={ false }
          options={ ACCOUNT_TYPES.map((type) => ({
            key: type ,
            value: type ,
            label: t(`account.types.${ type }`) ,
          })) }
          onValueChange={ (nextValue) => updateDraftValue('type' ,nextValue) }
        />

        <Input
          id="initial_balance"
          label={ t('account.form.label.initial_balance') }
          name="initial_balance"
          type="money"
          switchLanguage={locale === 'pt-BR' ? 'pt-BR' : 'en'}
          value={ draftAccount.initial_balance }
          required
          disabled={ disabled }
          onValueChange={ (nextValue) => updateDraftValue('initial_balance' ,nextValue) }
          placeholder={ t('account.form.placeholder.initial_balance') }
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
                    account ? t('form.save') : t('form.submit') }
                </Button>
              </>
            )
          }

        </div>
      </form>
    </div>
  );
}