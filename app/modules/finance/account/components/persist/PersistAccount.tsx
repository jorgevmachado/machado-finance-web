import React ,{ useEffect } from 'react';

import { translateI18nMessage ,useAppTranslation } from '@/app/shared';
import { Button ,Card ,Input ,Select ,Text } from '@/app/ds';

import { ActionState ,INITIAL_ACTION_STATE } from '@/app/modules/actions';

import type { TAccount, TDraftAccount } from '../../types';
import { accountBusiness  } from '../../business';
import { ACCOUNT_TYPES } from '../../constants';

type PersistAccountProps = {
  onClose: (actionState: ActionState) => void;
  account?: TAccount;
  disabled?: boolean;
};

export default function PersistAccount({
  onClose,
  account,
  disabled = false,
}: PersistAccountProps) {
  const { t, locale } = useAppTranslation();
  const [state ,setState] = React.useState<ActionState>(INITIAL_ACTION_STATE);
  const [isPending ,setIsPending] = React.useState(false);
  const [draftAccount ,setDraftAccount] = React.useState<TDraftAccount>(accountBusiness.initDraftAccount(account));

  const updateDraftValue = <K extends keyof TDraftAccount>(key: K ,value: TDraftAccount[K]) => {
    setDraftAccount((previousState) => ({
      ...previousState ,
      [key]: value ,
    }));
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
      <form className="flex flex-col gap-4">
        { !disabled && (
          <Text as="p" size="sm" color="text-slate-600">
            { t('account.form.subtitle') }
          </Text>
        )}
        <Input
          id="name"
          label={ t('form.nameLabel') }
          name="name"
          type="text"
          value={ draftAccount.name }
          required
          disabled={ disabled }
          onValueChange={ (nextValue) => updateDraftValue('name' ,nextValue) }
          placeholder={ t('form.namePlaceholder') }
        />

        <Select
          label={ t('form.typeLabel') }
          helperText={ !disabled ? t('account.form.typeHelper') : undefined }
          name="type"
          value={ draftAccount.type }
          required
          disabled={ disabled }
          caseSensitive={ false }
          options={ ACCOUNT_TYPES.map((type) => ({
            key: type ,
            value: type ,
            label: t(`account.types.${ type }`) ,
          })) }
          onValueChange={ (nextValue) => updateDraftValue('type' ,nextValue) }
        />

        <Input
          id="initial_balance"
          label={ t('account.form.label.initial_balance') }
          name="initial_balance"
          type="money"
          switchLanguage={locale === 'pt-BR' ? 'pt-BR' : 'en'}
          value={ draftAccount.initial_balance }
          required
          disabled={ disabled }
          onValueChange={ (nextValue) => updateDraftValue('initial_balance' ,nextValue) }
          placeholder={ t('account.form.placeholder.initial_balance') }
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
                <Button type="submit" disabled={ isPending }>
                  { isPending ?
                    t('form.submitting') :
                    account ? t('form.save') : t('form.submit') }
                </Button>
              </>
            )
          }

        </div>
      </form>
    </div>
  );
}