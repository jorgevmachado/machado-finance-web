'use client';
import React, { useState, useCallback } from 'react';

import { useAppTranslation } from '@/app/shared';
import { Button ,Input ,Select ,Text ,Table ,ETypeTableHeader } from '@/app/ds';

import { monthBusiness, TMonthKey, type TMonthSummary } from '../../business';
import { TMonthPersist } from '../../types';

type InputMonthsProps = {
  months?: Array<Record<string, unknown>>;
  referenceYear?: number;
  disabled?: boolean;
  onChange?: (months: Array<TMonthPersist>) => void;
};

type MonthInput = {
  amount: string;
  received_at: string;
};

export default function InputMonths({
  months = [],
  referenceYear = new Date().getFullYear(),
  disabled = false,
  onChange,
}: InputMonthsProps) {
  const { t } = useAppTranslation();

  const [selectedMonth, setSelectedMonth] = useState<TMonthKey | ''>('');
  const [currentInput, setCurrentInput] = useState<MonthInput>({ amount: '', received_at: '' });
  const [addedMonths, setAddedMonths] = useState<Array<TMonthSummary>>(monthBusiness.convertListToMonthSummary(months, referenceYear));

  const usedMonths = new Set(addedMonths.map((m) => m.reference_month));

  const availableMonths = monthBusiness.MONTH_KEYS.filter(
    (_, index) => !usedMonths.has(index + 1)
  );

  const handleOnChange = useCallback((monthsSummary: Array<TMonthSummary>) => {
    const persistMonths = monthBusiness.convertToMonthPersist(monthsSummary);
    if (onChange) {
      onChange(persistMonths);
    }
  },[onChange]);


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
      received_at: (item as TMonthSummary).received_at || '',
    });
    const monthKey = monthBusiness.getMonthName(item.reference_month);
    const currentMonth = addedMonths.find((m) => m.id === item.id);
    if (!currentMonth) {
      return;
    }
    handleRemove(currentMonth);
    setSelectedMonth(monthKey);
  }, [addedMonths, handleRemove]);
  
  const handleAdd = useCallback(() => {
    if (!selectedMonth) {
      return;
    }
    const monthIndex = monthBusiness.MONTH_KEYS.indexOf(selectedMonth);
    const monthSummary: TMonthSummary = {
      id: `${selectedMonth}-${Date.now()}`,
      month: selectedMonth,
      amount: parseFloat(currentInput.amount.replace(/\D/g, '')) / 100 || 0,
      received_at: currentInput.received_at,
      reference_year: referenceYear,
      reference_month: monthIndex + 1,
      created_at: new Date(),
    };

    const newMonths = [...addedMonths, monthSummary];
    const orderedMonths = monthBusiness.orderMonthsByReferenceMonth(newMonths);
    setAddedMonths(orderedMonths);
    handleOnChange(orderedMonths);
    setSelectedMonth('');
    setCurrentInput({ amount: '', received_at: '' });
  }, [addedMonths, currentInput.amount, currentInput.received_at, handleOnChange, referenceYear, selectedMonth]);





  return (
    <div className="space-y-4">
      {/* Seletor de meses e inputs */}
      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_1fr_1fr_auto]">
          <Select
            label={t('month.select')}
            name="select-month"
            value={selectedMonth.toLowerCase()}
            disabled={disabled || availableMonths.length === 0}
            options={availableMonths.map((key) => ({
              key,
              value: key,
              label: t(`month.${key}`),
            }))}
            onValueChange={(value) => setSelectedMonth(value.toLowerCase() as TMonthKey)}
          />

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

          <Input
            id="input-received-at"
            name="input-received-at"
            label={t('month.received_at')}
            type="date"
            value={currentInput.received_at}
            disabled={disabled || !selectedMonth}
            onValueChange={(value) =>
              setCurrentInput((prev) => ({ ...prev, received_at: value }))
            }
          />

          <Button
            type="button"
            appearance="solid"
            size="md"
            disabled={disabled || !selectedMonth || !currentInput.amount}
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
              { label: t('month.received_at'), value: 'received_at', type: ETypeTableHeader.DATE, sortable: false },
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