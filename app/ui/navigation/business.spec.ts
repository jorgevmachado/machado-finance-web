import { getAuthenticatedMenuItems } from './business';

describe('navigation business', () => {
  it('builds authenticated menu with translated labels and children', () => {
    const translate = (key: string) => `translated:${key}`;

    const items = getAuthenticatedMenuItems(translate);

    expect(items).toHaveLength(5);
    expect(items[0]).toMatchObject({
      label: 'translated:navigation.home',
      href: '/home',
      roles: ['USER', 'ADMIN'],
    });
    expect(items[3]).toMatchObject({
      label: 'translated:navigation.account',
      href: '/account',
    });
    expect(items[3].children?.[0]).toMatchObject({
      label: 'translated:navigation.income',
      href: '/account/income',
    });
    expect(items[4].children?.[0]).toMatchObject({
      label: 'translated:navigation.contribution',
      href: '/allocation/contribution',
    });
  });
});
