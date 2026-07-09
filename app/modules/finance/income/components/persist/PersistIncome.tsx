'use client';
import React ,{ useEffect } from 'react';

import { isObjectEmpty } from '@/app/utils';

import {
  createI18nMessage ,
  translateI18nMessage ,
  useAppTranslation,
} from '@/app/shared';

import { Button ,Card ,Input ,Text ,useLoading } from '@/app/ds';

import {
  ActionState ,
  INITIAL_ACTION_STATE ,
  mapError ,
  toErrorState,
} from '@/app/modules/actions';

import { financeBffService } from '@/app/modules/finance';

import type { TAccount } from '../../../account';
import { InputMonths ,TMonthPersist } from '../../../month';

import { incomeBusiness } from '../../business';

import type { TIncome, TIncomeCreate, TIncomeUpdate, TDraftIncome } from '../../types';


import {
  INCOME_DEFAULT_CREATE_ERROR_MESSAGE ,
  INCOME_DEFAULT_UPDATE_ERROR_MESSAGE ,
  validateCreatePayload ,
  validateUpdatePayload ,
} from '../../validation';

type PersistIncomeProps = {
  account: TAccount;
  income?: TIncome;
  onClose: (actionState: ActionState) => void;
  disabled?: boolean;
  referenceYear?: number;
};


export default function PersistIncome({
  income,
  account,
  onClose,
  disabled = false,
  referenceYear = new Date().getFullYear(),
}: PersistIncomeProps) {
  const { startContentLoading, stopContentLoading } = useLoading();
  const [state ,setState] = React.useState<ActionState>(INITIAL_ACTION_STATE);
  const [isPending ,setIsPending] = React.useState(false);
  const [draftIncome, setDraftIncome] = React.useState<TDraftIncome>(incomeBusiness.initDraft(referenceYear, income));
  const [monthsDraft, setMonthsDraft] = React.useState<Array<TMonthPersist>>([]);
  const { t } = useAppTranslation();

  const updateDraftValue = <K extends keyof TDraftIncome>(key: K, value: TDraftIncome[K]) => {
    setDraftIncome((previousState) => ({
      ...previousState,
      [key]: value,
    }));
  };


  const handleCreate = async () => {
    startContentLoading();
    const payload: TIncomeCreate = {
      months: monthsDraft.map((month) => ({ ...month, id: undefined })),
      source: draftIncome.source ,
      account_id: account.id,
      description: draftIncome.description ,
      reference_year: draftIncome.reference_year,
    };
    const validationError = validateCreatePayload(payload);

    if (validationError) {
      setState(validationError);
      setIsPending(false);
      return;
    }

    try {
      const response = await financeBffService.income.create({ payload });

      if (response.error) {
        setState(toErrorState(response.i18nMessageError || response.message || INCOME_DEFAULT_CREATE_ERROR_MESSAGE ,'create'));
        setIsPending(false);
        return;
      }
    } catch (error) {
      setState(mapError(error ,INCOME_DEFAULT_CREATE_ERROR_MESSAGE));
      setIsPending(false);
      return;
    } finally {
      stopContentLoading();
    }

    setState({
      type: 'create' ,
      status: 'success' ,
      message: createI18nMessage('income.messages.created') ,
    });
    setIsPending(false);
    stopContentLoading();
  };

  const handleUpdate = async (income: TIncome) => {
    startContentLoading();
    const payload: TIncomeUpdate = {};
    if (draftIncome.source !== income.source) {
      payload.source = draftIncome.source;
    }
    if (draftIncome.account_id && draftIncome.account_id !== income.account_id) {
      payload.account_id = draftIncome.account_id;
    }
    if (draftIncome.description !== income.description) {
      payload.description = draftIncome.description;
    }

    payload.months = monthsDraft;

    const emptyPayload = isObjectEmpty(payload);
    if (!emptyPayload) {
      const validationError = validateUpdatePayload(payload);
      if (validationError) {
        setState(validationError);
        setIsPending(false);
        return;
      }

      try {
        const response = await financeBffService.income.update({
          identifier: income.id ,
          payload ,
        });

        if (response.error) {
          setState(toErrorState(response.i18nMessageError || response.message || INCOME_DEFAULT_UPDATE_ERROR_MESSAGE ,'update'));
          setIsPending(false);
          return;
        }
      } catch (error) {
        setState(mapError(error ,INCOME_DEFAULT_UPDATE_ERROR_MESSAGE));
        setIsPending(false);
        return;
      } finally {
        stopContentLoading();
      }
    }

    setState({
      type: 'update' ,
      status: 'success' ,
      message: createI18nMessage('income.messages.updated') ,
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

    if (!income) {
      await handleCreate();
      return;
    }

    await handleUpdate(income);

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
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          id="source"
          label={t('income.source')}
          name="source"
          type="text"
          value={draftIncome.source}
          required
          disabled={disabled}
          onValueChange={(nextValue) => updateDraftValue('source', nextValue)}
          placeholder={t('income.form.placeholder.source')}
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
            value={draftIncome.description}
            required
            disabled={disabled}
            rows={4}
            className="w-full resize-none rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400"
            onChange={(event) => updateDraftValue('description', event.target.value)}
            placeholder={t('form.descriptionPlaceholder')}
          />
        </label>

        <InputMonths months={income?.months} disabled={disabled} onChange={(draft) => setMonthsDraft(draft)}/>

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
                    income ? t('form.save') : t('form.submit') }
                </Button>
              </>
            )
          }

        </div>
      </form>
    </div>
  );
}