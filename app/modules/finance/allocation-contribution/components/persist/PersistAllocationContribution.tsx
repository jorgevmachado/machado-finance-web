'use client';
import React ,{ useEffect ,useState } from 'react';

import { isObjectEmpty } from '@/app/utils';

import {
  createI18nMessage ,
  translateI18nMessage ,
  useAppTranslation,
} from '@/app/shared';

import { Button ,Card ,Input, Text ,useLoading } from '@/app/ds';

import {
  ActionState ,
  INITIAL_ACTION_STATE ,
  mapError ,
  toErrorState,
} from '@/app/modules/actions';

import { financeBffService } from '@/app/modules/finance';

import type { TAllocation } from '../../../allocation';
import { InputMonths ,TMonthPersist } from '../../../month';

import { allocationContributionBusiness } from '../../business';

import type { TAllocationContribution, TAllocationContributionCreate, TAllocationContributionUpdate, TDraftAllocationContribution } from '../../types';


import {
  ALLOCATION_CONTRIBUTION_DEFAULT_CREATE_ERROR_MESSAGE ,
  ALLOCATION_CONTRIBUTION_DEFAULT_UPDATE_ERROR_MESSAGE ,
  validateCreatePayload ,
  validateUpdatePayload ,
} from '../../validation';

type PersistAllocationContributionProps = {
  onClose: (actionState: ActionState) => void;
  disabled?: boolean;
  allocation: TAllocation;
  referenceYear?: number;
  allocationContribution?: TAllocationContribution;
};


export default function PersistAllocationContribution({
  onClose,
  disabled = false,
  allocation,
  referenceYear = new Date().getFullYear(),
  allocationContribution,
}: PersistAllocationContributionProps) {
  const { t } = useAppTranslation();
  const { startContentLoading, stopContentLoading } = useLoading();
  const [state ,setState] = useState<ActionState>(INITIAL_ACTION_STATE);
  const [isPending ,setIsPending] = useState(false);
  const [draftAllocationContribution, setDraftAllocationContribution] = useState<TDraftAllocationContribution>(allocationContributionBusiness.initDraft(referenceYear, allocationContribution));

  const [monthsDraft, setMonthsDraft] = useState<Array<TMonthPersist>>([]);

  const updateDraftValue = <K extends keyof TDraftAllocationContribution>(key: K, value: TDraftAllocationContribution[K]) => {
    setDraftAllocationContribution((previousState) => ({
      ...previousState,
      [key]: value,
    }));
  };

  const handleCreate = async () => {
    startContentLoading();
    const payload: TAllocationContributionCreate = {
      months: monthsDraft.map((month) => ({ ...month, id: undefined })),
      allocation_id: allocation.id,
      description: draftAllocationContribution.description ,
      reference_year: draftAllocationContribution.reference_year,
      contributor_name: draftAllocationContribution.contributor_name,
    };
    const validationError = validateCreatePayload(payload);

    if (validationError) {
      setState(validationError);
      setIsPending(false);
      return;
    }

    try {
      const response = await financeBffService.allocationContribution.create({ payload });

      if (response.error) {
        setState(toErrorState(response.i18nMessageError || response.message || ALLOCATION_CONTRIBUTION_DEFAULT_CREATE_ERROR_MESSAGE ,'create'));
        setIsPending(false);
        return;
      }
    } catch (error) {
      setState(mapError(error ,ALLOCATION_CONTRIBUTION_DEFAULT_CREATE_ERROR_MESSAGE));
      setIsPending(false);
      return;
    } finally {
      stopContentLoading();
    }

    setState({
      type: 'create' ,
      status: 'success' ,
      message: createI18nMessage('allocation-contribution.messages.created') ,
    });
    setIsPending(false);
    stopContentLoading();
  };

  const handleUpdate = async (allocationContribution: TAllocationContribution) => {
    startContentLoading();
    const payload: TAllocationContributionUpdate = {};
    if (draftAllocationContribution.contributor_name !== allocationContribution.contributor_name) {
      payload.contributor_name = draftAllocationContribution.contributor_name;
    }

    if (draftAllocationContribution.allocation_id && draftAllocationContribution.allocation_id !== allocationContribution.allocation.id) {
      payload.allocation_id = draftAllocationContribution.allocation_id;
    }

    if (draftAllocationContribution.description !== allocationContribution.description) {
      payload.description = draftAllocationContribution.description;
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
        const response = await financeBffService.allocationContribution.update({
          identifier: allocationContribution.id ,
          payload ,
        });

        if (response.error) {
          setState(toErrorState(response.i18nMessageError || response.message || ALLOCATION_CONTRIBUTION_DEFAULT_UPDATE_ERROR_MESSAGE ,'update'));
          setIsPending(false);
          return;
        }
      } catch (error) {
        setState(mapError(error ,ALLOCATION_CONTRIBUTION_DEFAULT_UPDATE_ERROR_MESSAGE));
        setIsPending(false);
        return;
      } finally {
        stopContentLoading();
      }
    }

    setState({
      type: 'update' ,
      status: 'success' ,
      message: createI18nMessage('allocation-contribution.messages.updated') ,
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

    if (!allocationContribution) {
      await handleCreate();
      return;
    }

    await handleUpdate(allocationContribution);

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
          id="contributor_name"
          label={t('allocation-contribution.form.label.contributor_name')}
          name="contributor_name"
          type="text"
          value={draftAllocationContribution.contributor_name}
          required
          disabled={disabled}
          onValueChange={(nextValue) => updateDraftValue('contributor_name', nextValue)}
          placeholder={t('allocation-contribution.form.placeholder.contributor_name')}
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
            value={draftAllocationContribution.description}
            required
            disabled={disabled}
            rows={4}
            className="w-full resize-none rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400"
            onChange={(event) => updateDraftValue('description', event.target.value)}
            placeholder={t('form.descriptionPlaceholder')}
          />
        </label>

        <InputMonths
          months={allocationContribution?.months}
          disabled={disabled}
          rules={{ dateField: 'received_at' }}
          onChange={(draft) => setMonthsDraft(draft)}
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
                    allocationContribution ? t('form.save') : t('form.submit') }
                </Button>
              </>
            )
          }
        </div>
      </form>
    </div>
  );
}