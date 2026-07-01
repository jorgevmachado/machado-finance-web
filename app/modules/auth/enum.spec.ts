import { EUserRole, EUserStatus } from './enum';

describe('auth enum constants', () => {
  it('exports user status values', () => {
    expect(EUserStatus.ACTIVE).toBe('ACTIVE');
    expect(EUserStatus.INACTIVE).toBe('INACTIVE');
  });

  it('exports user role values', () => {
    expect(EUserRole.USER).toBe('USER');
    expect(EUserRole.ADMIN).toBe('ADMIN');
  });
});
