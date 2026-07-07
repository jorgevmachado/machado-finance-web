export const EMonthStatus = {
  PAID: 'PAID',
  PENDING: 'PENDING',
  CANCELLED: 'CANCELLED',
} as const;

export type EMonthStatus = typeof EMonthStatus[keyof typeof EMonthStatus];