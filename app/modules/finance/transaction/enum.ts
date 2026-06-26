export const ETransactionType = {
  INCOME: 'INCOME',
  EXPENSE: 'EXPENSE',
  TRANSFER: 'TRANSFER',
} as const;

export type ETransactionType = typeof ETransactionType[keyof typeof ETransactionType];

export const ETransactionStatus = {
  PAID: 'PAID',
  PENDING: 'PENDING',
  CANCELLED: 'CANCELLED',
} as const;

export type ETransactionStatus = typeof ETransactionStatus[keyof typeof ETransactionStatus];