'use client';
import { useCallback ,useState } from 'react';

import { useAppTranslation } from '@/app/shared';

import { useAlert ,useLoading } from '@/app/ds';

import { financeBffService } from '@/app/modules/finance';

import type { TAccount } from './types';

type TAccountState = {
  account?: TAccount;
  isLoading: boolean;
  errorMessage?: string;
}

type UseAccountProps = {
  identifier: string;
}

type UseAccountResult = TAccountState & {
  fetchAccount: (accountId: string) => Promise<void>;
  handleRecalculateAccount: (accountId: string) => Promise<void>;
}

const useAccount = ({}: UseAccountProps): UseAccountResult => {
  const { t } = useAppTranslation();
  const { showAlert } = useAlert();
  const { startContentLoading, stopContentLoading } = useLoading();

  const [state, setState] = useState<TAccountState>({
    account: undefined,
    isLoading: true,
    errorMessage: undefined,
  });
  
  const filterRelations = useCallback((account: TAccount) => {
    account.expenses = account?.expenses?.filter((expense) => !expense.parent_id);
    return account;
  }, []);
  
  const fetchAccount = useCallback(async (accountId: string) => {
    setState((previousState) => ({
      ...previousState,
      isLoading: true,
      errorMessage: undefined,
    }));
    startContentLoading();
    try {
      const response = await financeBffService.account.detail({ identifier: accountId });
      if (response.error && !response?.data) {
        const message = t(response.i18nMessageError || 'common.unknown');
        setState({ account: undefined, isLoading: false, errorMessage: message });
        showAlert({ type: 'error', message });
        return;
      }
      const account = filterRelations(response.data as TAccount);
      setState({ account: account, isLoading: false, errorMessage: undefined });
    } catch (error) {
      const message = error instanceof Error && error.message ? error.message : t('common.unknown');
      setState({ account: undefined, isLoading: false, errorMessage: message });
      showAlert({ type: 'error', message });
    } finally {
      stopContentLoading();
    }
  }, [startContentLoading, filterRelations, t, showAlert, stopContentLoading]);

  const handleRecalculateAccount = useCallback(async (account_id: string) => {
    const fetchErrorMessage = 'account.error.recalculate';
    startContentLoading();
    try {

      const response = await financeBffService.account.recalculate(account_id);

      if (response.error && !response?.data) {
        const message = response.message || t(response.i18nMessageError);
        setState({ account: undefined, isLoading: false, errorMessage: message });
        showAlert({
          type: 'error',
          message: message,
        });
        return;
      }
      const account = filterRelations(response.data as TAccount);
      setState({ account: account, isLoading: false, errorMessage: undefined });
    } catch (error) {
      const errorMessage = error instanceof Error && error.message ? error.message : t(fetchErrorMessage);
      showAlert({
        type: 'error',
        message: errorMessage,
      });
      setState(( prevState) => ({ ...prevState, isLoading: false, errorMessage: errorMessage }));
    } finally {
      stopContentLoading();
    }
  }, [filterRelations, showAlert, startContentLoading, stopContentLoading, t]);

  return {
    ...state,
    fetchAccount,
    handleRecalculateAccount
  };
};
export default useAccount;