import { SupportedLocale } from '@/app/shared';

export type TCountry = SupportedLocale;

export function currencyFormatter(
  value: number | string,
  country: TCountry = 'pt-BR',
): string {
  const MAP = {
    'pt-BR': { locale: 'pt-BR', currency: 'BRL' },
    en: { locale: 'en-US', currency: 'USD' },
    es: { locale: 'es-ES', currency: 'EUR' },
  };
  const mapped = MAP[country];

  if (typeof value === 'string') {
    console.log('# => value => ', value);
    const digits = value.replace(/\D/g, '');
    if (!digits) {
      return '';
    }
    const digitsNumber = parseInt(digits, 10);

    return (digitsNumber / 100).toLocaleString(mapped.locale, {
      style: 'currency',
      currency: mapped.currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).replace(/\u00A0/, ' ');
  }

  return new Intl.NumberFormat(mapped.locale, {
    style: 'currency',
    currency: mapped.currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    maximumSignificantDigits: 7,
  })
    .format(value)
    .replace(/\s/, ' ');
}

export function removeCurrencyFormatter(value: string): number {
  return Number(value.replace(/[^0-9,-]+/g, ''));
}

export function digitsToDecimalString(value: string = ''): string {
  const rawValue = value.replace(/\D/g, '');
  if (!rawValue) {
    return '';
  }
  const digits = rawValue.replace(/^0+(?!$)/, '');
  return (parseInt(digits, 10) / 100).toFixed(2);

}