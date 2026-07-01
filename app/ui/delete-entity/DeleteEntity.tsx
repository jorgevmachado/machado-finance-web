import { useCallback } from 'react';

import { MessageResponse ,useAppTranslation } from '@/app/shared';

import { Button ,useLoading } from '@/app/ds';

import { type ActionState } from '@/app/modules/actions/state';

type DeleteEntityProps = {
  onClose: (actionState: ActionState) => void;
  endpoint: string;
  identifier: string;
  defaultErrorMessage?: string;

};
export default function DeleteEntity({
  onClose,
  endpoint,
  identifier,
  defaultErrorMessage = 'error.deletingData',
}: DeleteEntityProps) {

  const { t } = useAppTranslation();
  const { startContentLoading, stopContentLoading } = useLoading();
  
  const handleOnDelete = useCallback(async () => {
    startContentLoading();
    try {
      const deleteResponse = await fetch(`/api/${endpoint}/${identifier}`, {
        method: 'DELETE',
        cache: 'no-store',
      });

      const json = await deleteResponse.json() as MessageResponse;

      const response = !deleteResponse.ok
        ? {
          error: true,
          status: deleteResponse.status,
          message: 'message' in json && json.message ? json.message : defaultErrorMessage,
        }
        : {
          error: false,
          status: deleteResponse.status,
          message: 'OK',           
        };
      
      if (response.error){
        onClose({ status: 'error', type: 'delete', message: response.message });
      } else {
        onClose({ status: 'success', type: 'delete', message: response.message });
      }
    } catch (error) {
      const errorMessage = error instanceof Error && error.message ? error.message : t(defaultErrorMessage);
      onClose({ status: 'error', type: 'delete', message: errorMessage });
    } finally {
      stopContentLoading();
    }
  },[defaultErrorMessage, endpoint, identifier, onClose, startContentLoading, stopContentLoading, t]);
  
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