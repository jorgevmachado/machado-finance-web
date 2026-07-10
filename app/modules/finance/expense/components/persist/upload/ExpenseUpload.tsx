'use client';
import React ,{ useEffect ,useState } from 'react';

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

import { BANKS ,EBank } from '../../../../bank';
import type { TAllocation } from '../../../../allocation';
import { financeBffService } from '@/app/modules/finance';
import {
  EXPENSE_DEFAULT_UPLOAD_ERROR_MESSAGE,
  validateUploadPayload
} from '../../../validation';


import { TDraftExpenseUpload ,TExpenseUpload } from '../../../types';


type ExpenseUploadProps = {
  onClose: (actionState: ActionState) => void;
  allocation: TAllocation;
  referenceYear?: number;
}

const ALLOWED_UPLOAD_FILE_TYPES = '.pdf,.xls,.xlsx,application/pdf,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

export default function ExpenseUpload({ onClose, allocation, referenceYear }: ExpenseUploadProps) {
  const { t } = useAppTranslation();
  const [state ,setState] = useState<ActionState>(INITIAL_ACTION_STATE);
  const [isPending ,setIsPending] = useState(false);
  const [draftUpload, setDraftUpload] = useState<TDraftExpenseUpload>({ file: null, bank: '' });
  const [disabled] = useState(false);
  const isSubmitDisabled = isPending || disabled || !draftUpload.file || !draftUpload.bank;

  const { startContentLoading, stopContentLoading } = useLoading();
  
  const banksOptions = BANKS.map((bank) => ({ label: bank, value: bank }));

  const updateDraftValue = <K extends keyof TDraftExpenseUpload>(key: K, value: TDraftExpenseUpload[K]) => {
    setDraftUpload((previousState) => ({
      ...previousState,
      [key]: value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    startContentLoading();
    setIsPending(true);
    
    const payload: TExpenseUpload = {
      file: draftUpload.file as File,
      bank: draftUpload.bank as EBank,
      allocation_id: allocation.id,
      reference_year: referenceYear
    };

    const validationError = validateUploadPayload(payload);

    if (validationError) {
      setState(validationError);
      setIsPending(false);
      stopContentLoading();
      return;
    }
    
    try {
      const response = await financeBffService.expense.upload(payload);

      if (response.error) {
        setState(toErrorState(response.i18nMessageError || response.message || EXPENSE_DEFAULT_UPLOAD_ERROR_MESSAGE ,'create'));
        setIsPending(false);
        return;
      }
    } catch (error) {
      setState(mapError(error ,EXPENSE_DEFAULT_UPLOAD_ERROR_MESSAGE));
      setIsPending(false);
      return;
    } finally {
      stopContentLoading();
    }

    setState({
      type: 'create' ,
      status: 'success' ,
      message: createI18nMessage('expense.messages.uploaded') ,
    });
    setIsPending(false);
    stopContentLoading();
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

        <div className="flex-1">
          <Select
            label={t('expense.form.label.category')}
            name="category"
            value={draftUpload?.bank ?? ''}
            options={banksOptions}
            required
            defaultNoOptionLabel={t('common.noOptions')}
            placeholder={t('common.select')}
            onValueChange={(value) => {
              updateDraftValue('bank', value);
            }}
          />
        </div>

        <Input
          id="expense-upload-file"
          label={t('expense.upload.form.label.file')}
          name="file"
          type="file"
          required
          disabled={disabled || isPending}
          accept={ALLOWED_UPLOAD_FILE_TYPES}
          helperText={t('expense.upload.form.helper.file')}
          onChange={(event) => {
            const selectedFile = event.target.files?.[0] ?? null;
            updateDraftValue('file', selectedFile);
          }}
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
                <Button type="submit" disabled={ isSubmitDisabled }>
                  { isPending ?
                    t('form.submitting') :
                    t('form.upload') }
                </Button>
              </>
            )
          }

        </div>
      </form>
    </div>
  );

}