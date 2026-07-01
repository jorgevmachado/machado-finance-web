import { fireEvent, render, screen, waitFor } from '@testing-library/react';

const mockPush = jest.fn();
const mockRefresh = jest.fn();
const mockClearUser = jest.fn();
const mockLogoutAction = jest.fn().mockResolvedValue(undefined);

jest.mock('next/navigation', () => ({
  usePathname: () => '/home',
  useRouter: () => ({
    push: (...args: Array<unknown>) => mockPush(...args),
    refresh: (...args: Array<unknown>) => mockRefresh(...args),
  }),
}));

jest.mock('@/app/modules/auth', () => ({
  useUser: () => ({
    clearUser: mockClearUser,
  }),
}));

jest.mock('@/app/shared', () => ({
  useAppTranslation: () => ({
    t: (key: string) => {
      if (key === 'navigation.closeSidebar') return 'Close sidebar';
      return key;
    },
  }),
}));

jest.mock('@/app/modules/auth/actions', () => ({
  logoutAction: (...args: Array<unknown>) => mockLogoutAction(...args),
}));

jest.mock('./business', () => ({
  getAuthenticatedMenuItems: () => ([
    { label: 'Home', roles: ['USER', 'ADMIN'], href: '/home', icon: () => null },
    { label: 'Admin', roles: ['ADMIN'], href: '/admin', icon: () => null },
  ]),
}));

jest.mock('@/app/ui/navigation/navbar', () => ({
  Navbar: ({
    onToggleSidebar,
  }: {
    onToggleSidebar: () => void;
  }) => (
    <button type='button' onClick={onToggleSidebar}>
      toggle sidebar
    </button>
  ),
}));

jest.mock('@/app/ui/navigation/sidebar', () => ({
  Sidebar: ({
    items,
    onLogout,
  }: {
    items: Array<{ label: string }>;
    onLogout: () => void;
  }) => (
    <div>
      <span>sidebar-items:{items.map((item) => item.label).join(',')}</span>
      <button type='button' onClick={onLogout}>
        sign out
      </button>
    </div>
  ),
}));

jest.mock('@/app/ds', () => ({
  Breadcrumb: () => <div data-testid='breadcrumb'>breadcrumb</div>,
}));

import NavigationFrame from './NavigationFrame';

describe('NavigationFrame', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders public layout without sidebar when unauthenticated', () => {
    render(
      <NavigationFrame isAuthenticated={false}>
        <div>content</div>
      </NavigationFrame>,
    );

    expect(screen.getByText('content')).toBeInTheDocument();
    expect(screen.queryByText(/sidebar-items:/)).not.toBeInTheDocument();
    expect(screen.queryByTestId('breadcrumb')).not.toBeInTheDocument();
  });

  it('filters menu items by role and toggles sidebar overlay', () => {
    render(
      <NavigationFrame role='USER' isAuthenticated>
        <div>content</div>
      </NavigationFrame>,
    );

    expect(screen.getByText('sidebar-items:Home')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Close sidebar' })).toBeInTheDocument();
    expect(screen.getByTestId('breadcrumb')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'toggle sidebar' }));

    expect(screen.queryByRole('button', { name: 'Close sidebar' })).not.toBeInTheDocument();
  });

  it('clears user and redirects to login on logout', async () => {
    render(
      <NavigationFrame isAuthenticated>
        <div>content</div>
      </NavigationFrame>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'sign out' }));

    await waitFor(() => {
      expect(mockClearUser).toHaveBeenCalledTimes(1);
      expect(mockLogoutAction).toHaveBeenCalledTimes(1);
      expect(mockPush).toHaveBeenCalledWith('/login');
      expect(mockRefresh).toHaveBeenCalledTimes(1);
    });
  });
});
