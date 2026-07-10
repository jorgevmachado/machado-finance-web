export const EBank = {
  ITAU: 'ITAU',
  CAIXA: 'CAIXA',
  NUBANK: 'NUBANK',
} as const;

export type EBank = typeof EBank[keyof typeof EBank];