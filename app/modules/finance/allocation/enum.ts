export const EAllocationType = {
  OTHER: 'OTHER',
  HOUSE: 'HOUSE',
  FAMILY: 'FAMILY',
  PERSONAL: 'PERSONAL',
} as const;

export type EAllocationType = typeof EAllocationType[keyof typeof EAllocationType];