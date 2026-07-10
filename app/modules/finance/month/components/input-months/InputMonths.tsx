'use client';
import React, { useState, useCallback } from 'react';

import { useAppTranslation } from '@/app/shared';
import { Button ,Input ,Select ,Text ,Table ,ETypeTableHeader } from '@/app/ds';

import { EMonthStatus } from '../../enum';
import { monthBusiness, TMonthKey, type TMonthSummary } from '../../business';
import { TMonthPersist } from '../../types';

type TMonthDateField = 'received_at' | 'paid_at';

type TMonthInputRules = {
  dateField?: TMonthDateField;
  showStatusSelect?: boolean;
  showDateOnlyWhenStatusPaid?: boolean;
};

type InputMonthsProps = {
  months?: Array<Record<string, unknown>>;
  referenceYear?: number;
  disabled?: boolean;
  rules?: TMonthInputRules;
  onChange?: (months: Array<TMonthPersist>) => void;
};

type MonthInput = {
  amount: string;
  status?: EMonthStatus;
  received_at: string;
  paid_at: string;
};

export default function InputMonths({
  months = [],
  referenceYear = new Date().getFullYear(),
  disabled = false,
  rules,
  onChange,
}: InputMonthsProps) {
  const { t } = useAppTranslation();
  const dateField = rules?.dateField ?? 'received_at';
  const showStatusSelect = rules?.showStatusSelect ?? false;
  const showDateOnlyWhenStatusPaid = rules?.showDateOnlyWhenStatusPaid ?? false;

  const [selectedMonth, setSelectedMonth] = useState<TMonthKey | ''>('');
  const [currentInput, setCurrentInput] = useState<MonthInput>({
    amount: '',
    status: showStatusSelect ? EMonthStatus.PENDING : undefined,
    received_at: '',
    paid_at: '',
  });
  const [addedMonths, setAddedMonths] = useState<Array<TMonthSummary>>(monthBusiness.convertListToMonthSummary(months, referenceYear));
  const shouldShowDateInput = !showDateOnlyWhenStatusPaid || currentInput.status === EMonthStatus.PAID;

  const usedMonths = new Set(addedMonths.map((m) => m.reference_month));

  const availableMonths = monthBusiness.MONTH_KEYS.filter(
    (_, index) => !usedMonths.has(index + 1)
  );

  const handleOnChange = useCallback((monthsSummary: Array<TMonthSummary>) => {
    const persistMonths = monthBusiness.convertToMonthPersist(monthsSummary, {
      dateField,
      includeStatus: showStatusSelect,
    });
    if (onChange) {
      onChange(persistMonths);
    }
  },[dateField, onChange, showStatusSelect]);


  const handleRemove = useCallback((item: TMonthSummary) => {
    const index = addedMonths.findIndex((m) => m.id === item.id);
    if (index >= 0) {
      const newMonths = addedMonths.filter((_, idx) => idx !== index);
      const orderedMonths = monthBusiness.orderMonthsByReferenceMonth(newMonths);
      setAddedMonths(orderedMonths);
      handleOnChange(orderedMonths);
    }
  },[addedMonths, handleOnChange]);


  const handleEdit = useCallback((item: TMonthSummary) => {
    setCurrentInput({
      amount: item.amount.toString() || '',
      status: showStatusSelect ? (item.status ?? EMonthStatus.PENDING) : undefined,
      received_at: item.received_at || '',
      paid_at: item.paid_at || '',
    });
    const monthKey = monthBusiness.getMonthName(item.reference_month);
    const currentMonth = addedMonths.find((m) => m.id === item.id);
    if (!currentMonth) {
      return;
    }
    handleRemove(currentMonth);
    setSelectedMonth(monthKey);
  }, [addedMonths, handleRemove, showStatusSelect]);
  
  const handleAdd = useCallback(() => {
    if (!selectedMonth) {
      return;
    }
    const monthIndex = monthBusiness.MONTH_KEYS.indexOf(selectedMonth);
    const monthSummary: TMonthSummary = {
      id: `${selectedMonth}-${Date.now()}`,
      month: selectedMonth,
      amount: parseFloat(currentInput.amount.replace(/\D/g, '')) / 100 || 0,
      status: showStatusSelect ? currentInput.status : undefined,
      received_at: currentInput.received_at,
      paid_at: currentInput.paid_at,
      reference_year: referenceYear,
      reference_month: monthIndex + 1,
      created_at: new Date(),
    };

    const newMonths = [...addedMonths, monthSummary];
    const orderedMonths = monthBusiness.orderMonthsByReferenceMonth(newMonths);
    setAddedMonths(orderedMonths);
    handleOnChange(orderedMonths);
    setSelectedMonth('');
    setCurrentInput({
      amount: '',
      status: showStatusSelect ? EMonthStatus.PENDING : undefined,
      received_at: '',
      paid_at: '',
    });
  }, [addedMonths, currentInput.amount, currentInput.paid_at, currentInput.received_at, currentInput.status, handleOnChange, referenceYear, selectedMonth, showStatusSelect]);

  const dateInputLabel = dateField === 'paid_at' ? t('month.paid_at') : t('month.received_at');
  const dateInputValue = dateField === 'paid_at' ? currentInput.paid_at : currentInput.received_at;
  const shouldRequireDateForCurrentState = !showDateOnlyWhenStatusPaid || currentInput.status === EMonthStatus.PAID;
  const canAdd = Boolean(selectedMonth)
    && Boolean(currentInput.amount)
    && (!showStatusSelect || Boolean(currentInput.status))
    && (!shouldShowDateInput || !shouldRequireDateForCurrentState || Boolean(dateInputValue));
  const statusOptions = Object.values(EMonthStatus).map((status) => ({
    key: status,
    value: status,
    label: status,
  }));




  return (
    <div className="space-y-4">
      {/* Seletor de meses e inputs */}
      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
          <Select
            label={t('month.title')}
            name="select-month"
            value={selectedMonth.toLowerCase()}
            disabled={disabled || availableMonths.length === 0}
            options={availableMonths.map((key) => ({
              key,
              value: key,
              label: t(`month.${key}`),
            }))}
            defaultNoOptionLabel={t('common.noOptions')}
            placeholder={t('common.select')}
            onValueChange={(value) => setSelectedMonth(value.toLowerCase() as TMonthKey)}
          />

          {showStatusSelect && (
            <Select<EMonthStatus>
              label={t('common.status')}
              name="input-status"
              value={currentInput.status ?? ''}
              disabled={disabled || !selectedMonth}
              options={statusOptions}
              defaultNoOptionLabel={t('common.noOptions')}
              placeholder={t('common.select')}
              onValueChange={(statusValue) => {
                setCurrentInput((previousInput) => ({
                  ...previousInput,
                  status: statusValue,
                  paid_at: statusValue === EMonthStatus.PAID ? previousInput.paid_at : '',
                }));
              }}
            />
          )}

          <Input
            id="input-amount"
            name="input-amount"
            label={t('common.amount')}
            type="money"
            value={currentInput.amount}
            disabled={disabled || !selectedMonth}
            placeholder={t('common.amount')}
            onValueChange={(value) =>
              setCurrentInput((prev) => ({ ...prev, amount: value }))
            }
          />

          {shouldShowDateInput && (
            <Input
              id={`input-${dateField}`}
              name={`input-${dateField}`}
              label={dateInputLabel}
              type="date"
              value={dateInputValue}
              disabled={disabled || !selectedMonth}
              onValueChange={(value) =>
                setCurrentInput((previousInput) => ({
                  ...previousInput,
                  [dateField]: value,
                }))
              }
            />
          )}

          <Button
            type="button"
            appearance="solid"
            size="md"
            disabled={disabled || !canAdd}
            onClick={handleAdd}
            className="self-end"
          >
            {t('common.add')}
          </Button>
        </div>
      </div>

      {/* Tabela de meses adicionados */}
      {addedMonths.length > 0 && (
        <div>
          <Text as="h3" size="sm" weight="semibold" className="mb-2 text-slate-700">
            {t('common.added')}
          </Text>
          <Table
            items={addedMonths.map((month) => ({ ...month, month: t(`month.${month.month.toLowerCase()}`) }))}
            headers={[
              { label: t('month.title'), value: 'month', sortable: true },
              { label: t('common.amount'), value: 'amount', type: ETypeTableHeader.MONEY, sortable: true },
              ...(showStatusSelect ? [{ label: t('month.status'), value: 'status', sortable: false }] : []),
              {
                label: dateInputLabel,
                value: dateField,
                type: ETypeTableHeader.DATE,
                sortable: false,
              },
            ]}
            actions={{
              edit: {
                label: t('common.edit'),
                onClick: (item) => handleEdit(item as TMonthSummary )
              },
              delete: {
                label: t('common.delete'),
                onClick: (item) => handleRemove(item as TMonthSummary)
              },
            }}
            showNotFoundError={false}
          />
        </div>
      )}
    </div>
  );
}