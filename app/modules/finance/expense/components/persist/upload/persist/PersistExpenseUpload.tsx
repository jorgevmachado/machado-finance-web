'use client';
import React ,{ useCallback ,useEffect ,useMemo ,useState } from 'react';

import { createI18nMessage ,useAppTranslation } from '@/app/shared';
import { currencyFormatter ,formatDate } from '@/app/utils';

import {
  Button ,
  ETypeTableHeader ,
  Input ,
  Select ,
  Switch ,
  Table ,
  Text ,useLoading ,
} from '@/app/ds';

import {
  ActionState ,
  INITIAL_ACTION_STATE ,mapError ,
  toErrorState ,
} from '@/app/modules/actions';

import { monthBusiness } from '../../../../../month';
import type { TCategory } from '../../../../../category';

import { expenseBusiness } from '../../../../business';
import {
  TDraftExpenseUploaded ,
  TExpenseUploadResponse ,TPersistExpenseUploadInputs ,
} from '../../../../types';
import {
  validatePersistList
} from '@/app/modules/finance/expense/validation/validation';
import { financeBffService } from '@/app/modules/finance';
import {
  EXPENSE_DEFAULT_UPLOAD_ERROR_MESSAGE
} from '@/app/modules/finance/expense/validation';

type PersistExpenseUploadProps = {
  onClose: (actionState: ActionState) => void;
  response: TExpenseUploadResponse;
  categories: Array<TCategory>;
}


export default function PersistExpenseUpload({ response, onClose, categories }: PersistExpenseUploadProps) {
  const { t } = useAppTranslation();
  const [state ,setState] = useState<ActionState>(INITIAL_ACTION_STATE);
  const [isPending ,setIsPending] = useState(false);
  const [paid, setPaid] = useState<boolean>(false);
  const [draftExpenses, setDraftExpenses] = useState<Array<TDraftExpenseUploaded>>(expenseBusiness.initDraftExpenseUploaded(response.expenses));
  const [draftExpense, setDraftExpense] = useState<TDraftExpenseUploaded | undefined>(undefined);
  const [currentInput, setCurrentInput] = useState<TPersistExpenseUploadInputs>(expenseBusiness.initPersistExpenseUploadInputs());

  const { startContentLoading, stopContentLoading } = useLoading();
  console.log('# => PersistExpenseUpload => response.expenses.length', response.expenses.length);
  console.log('# => PersistExpenseUpload => draftExpenses.length', draftExpenses.length);

  const summary = useMemo(() => {
    const monthName = monthBusiness.getMonthName(response.reference_month);
    const result = [
      {  label: t('filters.year'), value: response.reference_year },
      {  label: t('month.title'), value: t(`month.${monthName}`) },
      {  label: t('expense.form.label.bank'), value: t(`bank.${response.bank.toLowerCase()}`) },
      {  label: t('common.total'), value: currencyFormatter(response.bill_total) }
    ];
    if (response.bill_due_date) {
      result.push({  label: t('expense.bill_due_date'), value: formatDate(response.bill_due_date) });
    }
    if (response.previous_bill_total) {
      result.push({  label: t('expense.previous_bill_total'), value: currencyFormatter(response.previous_bill_total) });
    }
    if (response.previous_bill_due_date) {
      result.push({  label: t('expense.previous_bill_due_date'), value: formatDate(response.previous_bill_due_date) });
    }

    return result;
  }, [response.bank, response.bill_due_date, response.bill_total, response.previous_bill_total, response.previous_bill_due_date, response.reference_month, response.reference_year, t]);

  const handleRemove = useCallback((item: TDraftExpenseUploaded) => {
    setDraftExpenses((previousDraftExpenses) => {
      const index = previousDraftExpenses.findIndex((e) => e.order === item.order);
      if (index < 0) {
        return previousDraftExpenses;
      }
      const newDraftExpenses = previousDraftExpenses.filter((_, idx) => idx !== index);
      return newDraftExpenses.sort((a, b) => a.order - b.order);
    });
  }, []);
  
  const handleEdit = useCallback((item: TDraftExpenseUploaded) => {
    setCurrentInput(expenseBusiness.initPersistExpenseUploadInputs(item));
    setDraftExpense(item);
    handleRemove(item);
  }, [handleRemove]);

  const handleAdd = () => {
    if (!draftExpense) {
      return;
    }
    const newDraftExpense: TDraftExpenseUploaded = {
      ...draftExpense,
      payee: currentInput.payee,
      amount: parseFloat(currentInput.amount.replace(/\D/g, '')) / 100 || 0,
      category: currentInput.category ?? draftExpense.category,
    };
    const newListDraftExpenses = [...draftExpenses, newDraftExpense];
    const orderedDraftExpenses = newListDraftExpenses.sort((a, b) => a.order - b.order);
    setDraftExpenses(orderedDraftExpenses);
    setDraftExpense(undefined);
    setCurrentInput(expenseBusiness.initPersistExpenseUploadInputs());
  };

  const tableContent = useMemo(() => {
    const expenses = [...draftExpenses];
    const header = [
      {
        label: t('expense.title'),
        value: 'payee'
      },
      {
        type: ETypeTableHeader.MONEY,
        label: t('common.amount'),
        value: 'amount'
      },
      {
        type: ETypeTableHeader.DATE,
        label: t('expense.form.label.date'),
        value: 'date',
      },
      {
        label: t('expense.form.label.installments'),
        value: 'installments'
      },
      {
        label: t('expense.category.name'),
        value: 'category.name'
      }
    ];
    return {
      header,
      body: expenses.map((expense) => ({ ...expense, installments: `${expense.current_installment}/${expense.total_of_installments}` })),
      actions: {
        edit: {
          label: t('common.edit'),
          onClick: (item: unknown) =>  handleEdit(item as TDraftExpenseUploaded)
        },
        delete: {
          label: t('common.delete'),
          onClick: (item: unknown) => handleRemove(item as TDraftExpenseUploaded)
        }
      }
      
    };
  }, [draftExpenses, handleEdit, handleRemove, t]);

  const canAdd = useMemo(() => {
    return !!draftExpense;
  }, [draftExpense]);

  const handleSubmit = useCallback(async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault();

    startContentLoading();
    setIsPending(true);

    const toPersist = expenseBusiness.convertUploadedToPersist(
      response,
      draftExpenses,
      paid,
    );

    const validationError = validatePersistList(toPersist);

    if (validationError) {
      setState(validationError);
      setIsPending(false);
      stopContentLoading();
      return;
    }

    try {
      const response = await financeBffService.expense.persistList(toPersist);

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

  }, [draftExpenses, paid, response, startContentLoading, stopContentLoading]);

  useEffect(() => {
    if (state.status !== 'idle') {
      onClose(
        { type: state.type ,status: state.status ,message: state.message });
      return;
    }
  } ,[onClose ,state]);

  return (
    <div className="space-y-4">
      { summary.map((item, index) => (
        <Text key={index} size="sm" weight="semibold" className="mb-2 text-slate-700">
          {item.label}: {item.value}
        </Text>
      ))}

      <Switch
        id="paid"
        name="paid"
        label={t('expense.form.label.paid')}
        checked={paid}
        onCheckedChange={(value) => setPaid(value)}
      />

      { draftExpense && (
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="flex flex-row gap-2">
            <Input
              id="payee"
              name="input-payee"
              label={t('expense.form.label.payee')}
              type="text"
              value={currentInput.payee}
              placeholder={t('expense.form.placeholder.payee')}
              onValueChange={(value) =>
                setCurrentInput((prev) => ({ ...prev, payee: value }))
              }
            />
            <Input
              id="input-amount"
              name="input-amount"
              label={t('common.amount')}
              type="money"
              value={currentInput.amount}
              placeholder={t('common.amount')}
              onValueChange={(value) =>
                setCurrentInput((prev) => ({ ...prev, amount: value }))
              }
            />
            <div className="flex items-end gap-2">
              <div className="flex-1">
                <Select
                  label={t('expense.form.label.category')}
                  name="category"
                  value={currentInput.category?.id ?? ''}
                  options={expenseBusiness.getCategoryOptions(categories)}
                  required
                  defaultNoOptionLabel={t('common.noOptions')}
                  placeholder={t('common.select')}
                  onValueChange={(value) => {
                    const found = categories.find((c) => c.id === value);
                    setCurrentInput((prev) => ({ ...prev, category: found }));
                  }}
                />
              </div>
            </div>
            <Button
              type="button"
              appearance="solid"
              size="md"
              disabled={!canAdd}
              onClick={handleAdd}
              className="self-end"
            >
              {t('common.add')}
            </Button>
          </div>

        </div>
      )}

      <Table
        items={tableContent.body}
        headers={tableContent.header}
        actions={tableContent.actions}
      />
      <div className="flex items-center justify-end gap-2 pt-2">
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
          <Button type="submit" disabled={ isPending } onClick={handleSubmit}>
            { isPending ?
              t('form.submitting') :
              t('form.submit') }
          </Button>
        </>

      </div>
    </div>
  );
}