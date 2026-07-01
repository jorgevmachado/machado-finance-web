export const EExpenseStatus = {
  PAID: 'PAID',
  PENDING: 'PENDING',
  CANCELLED: 'CANCELLED',
} as const;

export type EExpenseStatus = typeof EExpenseStatus[keyof typeof EExpenseStatus];