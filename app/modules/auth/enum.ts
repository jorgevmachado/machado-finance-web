export const EUserStatus = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
} as const;

export type EUserStatus = typeof EUserStatus[keyof typeof EUserStatus];

export const EUserRole = {
  USER: 'USER',
  ADMIN: 'ADMIN',
} as const;

export type EUserRole = typeof EUserRole[keyof typeof EUserRole];