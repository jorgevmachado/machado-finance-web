import { getAuthenticatedMenuItems } from './business';

describe('navigation business', () => {
  it('builds authenticated menu with translated labels', () => {
    const translate = (key: string) => `translated:${key}`;

    const items = getAuthenticatedMenuItems(translate);

    expect(items).toHaveLength(5);
    expect(items[0]).toMatchObject({
      label: 'translated:navigation.home',
      href: '/home',
      roles: ['USER', 'ADMIN'],
    });
    expect(items[3]).toMatchObject({
      label: 'translated:navigation.transaction',
      href: '/transaction',
      roles: ['USER', 'ADMIN'],
    });
    expect(items[4]).toMatchObject({
      label: 'translated:navigation.account',
      href: '/account',
      roles: ['USER', 'ADMIN'],
    });
  });
});
