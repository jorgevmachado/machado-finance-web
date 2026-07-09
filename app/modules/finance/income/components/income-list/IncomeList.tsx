import React ,{ useMemo } from 'react';

import { useAppTranslation } from '@/app/shared';

import { Button ,Table ,Text ,useAlert ,useModal } from '@/app/ds';

import { ActionState } from '@/app/modules/actions';

import { movementBusiness } from '../../../movement';

import type { TIncome } from '../../types';
import { incomeBusiness } from '../../business';
import { PersistIncome } from '../persist';

import type { TAccount } from '../../../account';


type IncomeListProps = {
  account: TAccount;
  incomes: Array<TIncome>;
  referenceYear: number;
}

export default function IncomeList({ incomes, account, referenceYear }: IncomeListProps) {
  const { t } = useAppTranslation();
  const { openModal ,modal ,closeModal } = useModal();
  const { showAlert } = useAlert();

  const textTree = useMemo(() => {
    return [
      { value: 'source', label: 'income.source' },
      { value: 'total', label: 'common.total' },
    ];
  }, []);

  const incomeTable = useMemo(() => {
    return movementBusiness.generateMovementTable({
      entities: incomes,
      sortable: true,
      referenceYear,
      chooseValues: textTree.map((item) => item.value),
    });
  }, [incomes, referenceYear, textTree]);

  const translatedHeaders = useMemo(() => {
    return incomeTable.headers.map((header) => {
      const translatedLabel = textTree.find((item) => item.value === header.value)?.label || header.label;
      const currentFooter  = textTree.find((item) => item.value === header.footer)?.label;
      const translatedFooter = currentFooter ? t(currentFooter.toString()) : header.footer;
      
      return {
        ...header,
        label: t(translatedLabel),
        footer: translatedFooter
      };
    });
  }, [incomeTable.headers, t, textTree]);

  const handleCloseModal = (actionState: ActionState) => {
    if (actionState.status !== 'cancel') {
      const message = incomeBusiness.getResponseMessage(actionState);
      showAlert({
        type: actionState.status === 'success' ? 'success' : 'error',
        message: t(message)
      });
      // clearInputFilters();
      // void reload();
    }
    closeModal();
  };


  const handlePersistModal = (item?: unknown, disabled?: boolean) => {
    const income = incomeBusiness.getOriginal(incomes ?? [], item);
    openModal({
      title: income ? t('income.edit.title', { name: income.source }) : t('income.create.title'),
      body: <PersistIncome income={income} account={account} onClose={handleCloseModal} disabled={disabled} />,
    });
  };



  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Text as="h2" className="text-3xl font-bold text-slate-950 sm:text-4xl">
            { t('income.title') } ({ referenceYear })
          </Text>
        </div>
        <div>
          <Button type="button" onClick={ handlePersistModal } appearance="solid" tone="primary">
            { t('income.create.title') }
          </Button>
        </div>
      </div>
      <Table
        items={incomeTable.body}
        headers={translatedHeaders}
        withFooter={true}
        onRowClick={(item) => handlePersistModal(item)}
        showNotFoundError={true}
      />
      {modal}
    </div>
  );
}