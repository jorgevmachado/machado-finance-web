export const EAccountType = {
  PIX: 'PIX',
  BANK: 'BANK',
  CASH: 'CASH',
  OTHER: 'OTHER',
  INVESTMENT: 'INVESTMENT',
  ACCOUNT_DEBIT: 'ACCOUNT_DEBIT',
} as const;

export type EAccountType = typeof EAccountType[keyof typeof EAccountType];