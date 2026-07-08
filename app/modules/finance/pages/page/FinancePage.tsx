'use client';

import { Button ,Card ,Text ,useAlert ,useLoading } from '@/app/ds';
import { useUser } from '@/app/modules/auth';
import { useRouter } from 'next/navigation';
import { currencyFormatter } from '@/app/utils';
import { useCallback ,useMemo ,useState } from 'react';
import { financeBffService ,TFinance } from '@/app/modules/finance';
import { useAppTranslation } from '@/app/shared';

const MOCK_FINANCE_SUMMARY = [
  { label: 'Saldo atual', value: currencyFormatter(8432.54), tone: 'text-emerald-600' },
  { label: 'Receitas do mês', value: currencyFormatter(12450.23), tone: 'text-sky-600' },
  { label: 'Despesas do mês', value: currencyFormatter(4017.69), tone: 'text-rose-600' },
  { label: 'Meta de economia', value: '32%', tone: 'text-violet-600' },
];

export default function FinancePage() {
  const router = useRouter();
  
  const { user } = useUser();
  const { t } = useAppTranslation();
  
  const [finance, setFinance] = useState<TFinance | undefined>(user?.finance);
  
  const hasFinance = useMemo(() => Boolean(finance), [finance]);
  const hasAccounts = useMemo(() => Boolean(finance?.accounts?.length), [finance?.accounts?.length]);

  const { startContentLoading, stopContentLoading } = useLoading();
  const { showAlert } = useAlert();

  const onboardFinance = useCallback(async () => {
    startContentLoading();
    try {
      const response =  await financeBffService.onboarding();
      if (response.error) {
        const message = response.message || t(response.i18nMessageError);
        showAlert({
          type: 'error',
          message: t(message)
        });
        return;
      }
      showAlert({
        type: 'success',
        message: t(response.i18nMessageSuccess)
      });
      setFinance(finance);
    } finally {
      stopContentLoading();
    }
  }, [finance, showAlert, startContentLoading, stopContentLoading, t]);

  if (!hasFinance) {
    return (
      <section className="mx-auto w-full max-w-4xl p-4 md:p-6">
        <Card
          rounded="2xl"
          variant="elevated"
          className="border-slate-200 bg-gradient-to-br from-white via-slate-50 to-sky-50 p-8"
        >
          <div className="space-y-4 text-center">
            <Text as="h1" size="3xl" weight="bold" className="text-slate-900">
              Você ainda não possui uma finança criada
            </Text>
            <Text className="mx-auto max-w-2xl text-slate-600">
              Comece agora para acompanhar saldo, receitas e despesas em um único painel.
            </Text>
            <div className="pt-2">
              <Button
                type="button"
                appearance="solid"
                size="lg"
                onClick={() => onboardFinance()}
              >
                Inicializar finança
              </Button>
            </div>
          </div>
        </Card>
      </section>
    );
  }

  if (!hasAccounts) {
    return (
      <section className="mx-auto w-full max-w-4xl p-4 md:p-6">
        <Card
          rounded="2xl"
          variant="elevated"
          className="border-slate-200 bg-gradient-to-br from-white via-slate-50 to-emerald-50 p-8"
        >
          <div className="space-y-4 text-center">
            <Text as="h1" size="3xl" weight="bold" className="text-slate-900">
              Você precisa criar uma conta primeiro
            </Text>
            <Text className="mx-auto max-w-2xl text-slate-600">
              Para começar a usar sua finança, crie uma conta e depois acompanhe os dados no painel.
            </Text>
            <div className="pt-2">
              <Button
                type="button"
                appearance="solid"
                size="lg"
                onClick={() => router.push('/acccounts')}
              >
                Criar conta
              </Button>
            </div>
          </div>
        </Card>
      </section>
    );
  }

  return (
    <section className="mx-auto w-full max-w-6xl space-y-6 p-4 md:p-6">
      <header className="space-y-2">
        <Text as="h1" size="3xl" weight="bold" className="text-slate-900">
          Olá, {user?.name}
        </Text>
        <Text className="text-slate-600">
          Aqui está um resumo rápido com informações mockadas da sua finança.
        </Text>
      </header>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {MOCK_FINANCE_SUMMARY.map((item) => (
          <Card
            key={item.label}
            rounded="xl"
            variant="elevated"
            className="border-slate-200 bg-white p-5"
          >
            <Text size="sm" className="uppercase tracking-wide text-slate-500">
              {item.label}
            </Text>
            <Text as="h2" size="2xl" weight="bold" className={`mt-2 ${item.tone}`}>
              {item.value}
            </Text>
          </Card>
        ))}
      </div>
    </section>
  );
}