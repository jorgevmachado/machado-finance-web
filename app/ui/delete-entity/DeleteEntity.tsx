import { useCallback } from 'react';

import {
  MessageResponse ,
  TBffDeleteParams ,
  TBffResponse ,
  useAppTranslation,
} from '@/app/shared';

import { Button ,useLoading } from '@/app/ds';

import { type ActionState } from '@/app/modules/actions';

type FetchDeleteFn = (params: TBffDeleteParams) => Promise<TBffResponse<MessageResponse>>;

type DeleteEntityProps = {
  onClose: (actionState: ActionState) => void;
  identifier: string;
  fetchDelete: FetchDeleteFn;
  defaultErrorMessage?: string;

};
export default function DeleteEntity({
  onClose,
  identifier,
  fetchDelete,
  defaultErrorMessage = 'error.deletingData',
}: DeleteEntityProps) {

  const { t } = useAppTranslation();
  const { startContentLoading, stopContentLoading } = useLoading();
  
  const handleOnDelete = useCallback(async () => {
    startContentLoading();
    try {
      const response = await fetchDelete({ identifier });

      onClose({ status: response.error ? 'error' : 'success', type: 'delete', message: response.message });
    } catch (error) {
      const errorMessage = error instanceof Error && error.message ? error.message : t(defaultErrorMessage);
      onClose({ status: 'error', type: 'delete', message: errorMessage });
    } finally {
      stopContentLoading();
    }
  },[defaultErrorMessage, fetchDelete, identifier, onClose, startContentLoading, stopContentLoading, t]);
  
  return (
    <div className="flex gap-2 mt-1 justify-end">
      <Button onClick={() => onClose({ status: 'cancel', type: 'delete', message: '' })}>
        {t('form.cancel')}
      </Button>
      <Button onClick={handleOnDelete} tone="danger">
        { t('form.delete') }
      </Button>
    </div>
  );
}