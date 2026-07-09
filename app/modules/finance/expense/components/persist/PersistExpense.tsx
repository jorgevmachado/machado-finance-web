'use client';
import React ,{ useEffect ,useState } from 'react';

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

import type { TAllocation } from '../../../allocation';
import type { TCategory } from '../../../category';
import { InputMonths ,TMonthPersist } from '../../../month';

import { expenseBusiness } from '../../business';

import type { TExpense, TExpenseCreate, TExpenseUpdate, TDraftExpense } from '../../types';


import {
  EXPENSE_DEFAULT_CREATE_ERROR_MESSAGE ,
  EXPENSE_DEFAULT_UPDATE_ERROR_MESSAGE ,
  validateCreatePayload ,
  validateUpdatePayload ,
} from '../../validation';

type PersistIncomeProps = {
  onClose: (actionState: ActionState) => void;
  expense?: TExpense;
  disabled?: boolean;
  categories: Array<TCategory>;
  allocation: TAllocation;
  referenceYear?: number;
};


export default function PersistExpense({
  expense,
  onClose,
  disabled = false,
  categories,
  allocation,
  referenceYear = new Date().getFullYear(),
}: PersistIncomeProps) {
  const { t } = useAppTranslation();
  const { startContentLoading, stopContentLoading } = useLoading();
  const [state ,setState] = useState<ActionState>(INITIAL_ACTION_STATE);
  const [isPending ,setIsPending] = useState(false);
  const [draftExpense, setDraftIncome] = useState<TDraftExpense>(expenseBusiness.initDraft(referenceYear, expense));
  const [draftCategory, setDraftCategory] = useState<TCategory | undefined>(undefined);
  const [monthsDraft, setMonthsDraft] = useState<Array<TMonthPersist>>([]);


  const updateDraftValue = <K extends keyof TDraftExpense>(key: K, value: TDraftExpense[K]) => {
    setDraftIncome((previousState) => ({
      ...previousState,
      [key]: value,
    }));
  };


  const handleCreate = async () => {
    if (!draftCategory) {
      return;
    }
    startContentLoading();
    const payload: TExpenseCreate = {
      months: monthsDraft.map((month) => ({ ...month, id: undefined })),
      payee: draftExpense.payee ,
      category_id: draftCategory.id,
      allocation_id: allocation.id,
      description: draftExpense.description ,
      reference_year: draftExpense.reference_year,
    };
    const validationError = validateCreatePayload(payload);

    if (validationError) {
      setState(validationError);
      setIsPending(false);
      return;
    }

    try {
      const response = await financeBffService.expense.create({ payload });

      if (response.error) {
        setState(toErrorState(response.i18nMessageError || response.message || EXPENSE_DEFAULT_CREATE_ERROR_MESSAGE ,'create'));
        setIsPending(false);
        return;
      }
    } catch (error) {
      setState(mapError(error ,EXPENSE_DEFAULT_CREATE_ERROR_MESSAGE));
      setIsPending(false);
      return;
    } finally {
      stopContentLoading();
    }

    setState({
      type: 'create' ,
      status: 'success' ,
      message: createI18nMessage('expense.messages.created') ,
    });
    setIsPending(false);
    stopContentLoading();
  };

  const handleUpdate = async (expense: TExpense) => {
    startContentLoading();
    const payload: TExpenseUpdate = {};
    if (draftExpense.payee !== expense.payee) {
      payload.payee = draftExpense.payee;
    }
    if (draftExpense.category_id && draftExpense.category_id !== expense.category.id) {
      payload.category_id = draftExpense.category_id;
    }
    if (draftExpense.allocation_id && draftExpense.allocation_id !== expense.allocation.id) {
      payload.allocation_id = draftExpense.allocation_id;
    }
    if (draftExpense.description !== expense.description) {
      payload.description = draftExpense.description;
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
          identifier: expense.id ,
          payload ,
        });

        if (response.error) {
          setState(toErrorState(response.i18nMessageError || response.message || EXPENSE_DEFAULT_UPDATE_ERROR_MESSAGE ,'update'));
          setIsPending(false);
          return;
        }
      } catch (error) {
        setState(mapError(error ,EXPENSE_DEFAULT_UPDATE_ERROR_MESSAGE));
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

    if (!expense) {
      await handleCreate();
      return;
    }

    await handleUpdate(expense);

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
          id="payee"
          label={t('expense.payee')}
          name="payee"
          type="text"
          value={draftExpense.payee}
          required
          disabled={disabled}
          onValueChange={(nextValue) => updateDraftValue('payee', nextValue)}
          placeholder={t('expense.form.placeholder.payee')}
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
            value={draftExpense.description}
            required
            disabled={disabled}
            rows={4}
            className="w-full resize-none rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400"
            onChange={(event) => updateDraftValue('description', event.target.value)}
            placeholder={t('form.descriptionPlaceholder')}
          />
        </label>

        <InputMonths months={expense?.months} disabled={disabled} onChange={(draft) => setMonthsDraft(draft)}/>

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
                    expense ? t('form.save') : t('form.submit') }
                </Button>
              </>
            )
          }

        </div>
      </form>
    </div>
  );
}