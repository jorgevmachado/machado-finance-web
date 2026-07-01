export const EAccountType = {
  PIX: 'PIX',
  BANK: 'BANK',
  CASH: 'CASH',
  OTHER: 'OTHER',
  INVESTMENT: 'INVESTMENT',
  CREDIT_CARD: 'CREDIT_CARD',
  ACCOUNT_DEBIT: 'ACCOUNT_DEBIT',
} as const;

export type EAccountType = typeof EAccountType[keyof typeof EAccountType];