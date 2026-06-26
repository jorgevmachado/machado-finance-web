export const ECategoryType = {
  FOOD: 'FOOD',
  OTHER: 'OTHER',
  STUDIES: 'STUDIES',
  UTILITY: 'UTILITY',
  HEALTH: 'HEALTH',
  PERSONAL: 'PERSONAL',
  TRANSPORT: 'TRANSPORT',
  ENTERTAINMENT: 'ENTERTAINMENT',
  GOVERNMENT_FEES: 'GOVERNMENT_FEES'
} as const;

export type ECategoryType = typeof ECategoryType[keyof typeof ECategoryType];