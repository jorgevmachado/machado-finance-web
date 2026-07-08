'use client';
import React ,{ useState } from 'react';

import { useAppTranslation } from '@/app/shared';

import { Input ,Text } from '@/app/ds';

import { monthBusiness ,type TDraftMonth ,TMonthKey } from '../../business';


type InputMonthsProps = {
  months?: Array<Record<string, unknown>>;
  disabled?: boolean;
  onChange?: (draft: TDraftMonth) => void
};

export default function InputMonths({
  months,
  disabled,
  onChange
}: InputMonthsProps) {
  const { t } = useAppTranslation();

  const [monthDraft, setMonthDraft] = useState<TDraftMonth>(() => monthBusiness.initDraft(months));

  const updateDraftValue = (month: TMonthKey, key: string, value: string) => {
    setMonthDraft((previousState) => ({
      ...previousState,
      [month]: {
        [key]: value,
      }
    }));
    onChange?.(monthDraft);
  };

  return (
    <div className="grid grid-cols-1 gap-3">
      {monthBusiness.MONTH_KEYS.map((monthKey) => (
        <div
          key={monthKey}
          className="grid grid-cols-1 items-end gap-3 rounded-xl border border-slate-100 bg-slate-50/60 p-3 md:grid-cols-[minmax(140px,1fr)_2fr_2fr]"
        >
          <Text as="p" size="sm" weight="semibold" className="uppercase text-slate-600">
            {monthKey}
          </Text>
          <Input
            id={`${monthKey}-amount`}
            name={`${monthKey}-amount`}
            label={t('common.amount')}
            type="money"
            value={monthDraft[monthKey].amount}
            disabled={disabled}
            placeholder={t('common.amount')}
            onValueChange={(nextValue) => updateDraftValue(monthKey, 'amount', nextValue)}
          />
          <Input
            id={`${monthKey}-received-at`}
            name={`${monthKey}-received-at`}
            label="received_at"
            type="date"
            value={monthDraft[monthKey].received_at}
            disabled={disabled}
            onValueChange={(nextValue) => updateDraftValue(monthKey, 'received_at', nextValue)}
          />
        </div>
      ))}
    </div>
  );
}