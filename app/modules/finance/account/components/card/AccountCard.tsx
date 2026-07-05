import { FaCreditCard ,FaMoneyBillWave } from 'react-icons/fa';

import { useAppTranslation } from '@/app/shared';
import { Badge ,Button ,Card ,Text } from '@/app/ds';

import type { TAccount } from '../../types';
import { EAccountType } from '../../enum';
import { FaPix } from 'react-icons/fa6';
import { RiBankFill } from 'react-icons/ri';
import { MdTrendingUp } from 'react-icons/md';
import { TbLayersDifference } from 'react-icons/tb';
import { useMemo } from 'react';
import { currencyFormatter } from '@/app/utils';
import { useRouter } from 'next/navigation';

type AccountCardProps = {
  onEdit: (account: TAccount) => void;
  item: TAccount;
}

export default function AccountCard({ onEdit, item }: AccountCardProps) {
  const { t, locale } = useAppTranslation();
  const router = useRouter();
  
  const renderIcon = (type: TAccount['type']) => {
    switch (type) {
      case EAccountType.PIX:
        return <FaPix size={128} color="#32BCAD" />;
      case EAccountType.BANK:
        return <RiBankFill size={128} color="#047A55" />;
      case EAccountType.CASH:
        return <FaMoneyBillWave size={128} color="#10b981" />;
      case EAccountType.INVESTMENT:
        return <MdTrendingUp size={128} color="#10B981" />;
      case EAccountType.ACCOUNT_DEBIT:
        return <FaCreditCard size={128} color="#DC2626" />;
      case EAccountType.OTHER:
      default:
        return <TbLayersDifference size={128} color="4A5568" />;
    }
  };

  const attributes = useMemo(() => {
    const list: Array<{ label: string; value: string | number | undefined; color?: string }> = [
      {
        label: t('account.form.label.initial_balance') ,
        value: currencyFormatter(item.initial_balance ,locale),
      } ,
      {
        label: t('account.form.label.current_balance') ,
        value: currencyFormatter(item.current_balance ,locale),
        color: item.current_balance > 0 ? 'text-green-600' : item.current_balance < 0 ? 'text-red-600' : 'text-slate-500',
      } ,
      { label: t('account.total_expenses') ,value: item?.expenses?.length } ,
      { label: t('account.total_incomes') ,value: item?.incomes?.length } ,
      {
        label: t('account.total_outgoing_transfers') ,
        value: item?.outgoing_transfers?.length,
      } ,
      {
        label: t('account.total_allocation_contributions') ,
        value: item?.allocation_contributions?.length,
      } ,
    ];
    return list;
  } ,[
    item?.allocation_contributions?.length ,
    item.current_balance ,
    item?.expenses?.length ,
    item?.incomes?.length ,
    item.initial_balance ,
    item?.outgoing_transfers?.length ,
    locale ,
    t]);
  
  return (
    <Card
      variant="elevated"
      rounded="lg"
      hoverEffect="lift"
      interactive={ true }
      onClick={ (e) => {
        e.preventDefault();
        onEdit(item);
      } }
      className="flex h-full flex-col gap-4 border-slate-200 bg-white"
    >
      <div className="flex min-h-44 items-center justify-center rounded-lg bg-slate-100">
        {renderIcon(item.type)}
      </div>
      <div className="space-y-3 px-1 pb-1 pt-4">
        <div className="flex items-center justify-between gap-2">
          <Text
            size="sm"
            color="text-slate-400"
            weight="extrabold"
            className="uppercase tracking-[0.16em]"
          >
            { item.name }
          </Text>
          <Badge tone={item.is_active ? 'success' : 'warning'} variant="soft">
            {item.is_active ? 'Active' : 'Inactive'}
          </Badge>
        </div>
        {attributes.map((attr) => (
          <div key={attr.label} className="flex items-center justify-between gap-2">
            <Text
              as="p"
              size="sm"
              className="font-bold text-slate-500">
              {attr.label}:
            </Text>
            <Text
              as="p"
              size="sm"
              color={attr.color ?? 'text-slate-500'}
              className="font-medium">
              {attr.value}
            </Text>
          </div>
        ))}
      </div>
      <div className="flex justify-center pt-2 mb-2">
        <Button
          type="button"
          size="lg"
          appearance="solid"
          fullWidth={true}
          onClick={(e) => {
            e.preventDefault();
            router.push(`/account/${item.id}`);
          }}
        >
          {t('common.viewMore')}
        </Button>
      </div>
    </Card>
  );
}