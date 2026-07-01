import { fireEvent, render, screen } from '@testing-library/react';

jest.mock('@/app/shared', () => ({
  useAppTranslation: () => ({
    t: (key: string) => {
      const map: Record<string, string> = {
        'navigation.expandSidebar': 'Expand sidebar',
        'navigation.collapseSidebar': 'Collapse sidebar',
        'navigation.pokeballLogo': 'Finance logo',
        'navigation.title': 'Machado Finance',
        'navigation.subtitle': 'Control panel',
      };

      return map[key] ?? key;
    },
  }),
}));

jest.mock('@/app/ui/navigation/language-switcher', () => ({
  LanguageSwitcher: () => <div data-testid='language-switcher'>language</div>,
}));

import Navbar from './Navbar';

describe('Navbar', () => {
  it('renders authenticated navbar and toggles sidebar', () => {
    const onToggleSidebar = jest.fn();

    render(
      <Navbar
        isAuthenticated
        isSidebarCollapsed={false}
        onToggleSidebar={onToggleSidebar}
      />,
    );

    expect(screen.getByLabelText('Finance logo')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Machado Finance' })).toBeInTheDocument();
    expect(screen.getByText('Control panel')).toBeInTheDocument();
    expect(screen.getByTestId('language-switcher')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Collapse sidebar' }));
    expect(onToggleSidebar).toHaveBeenCalledTimes(1);
  });

  it('uses expand label when sidebar is collapsed and hides toggle for public navbar', () => {
    const { rerender } = render(
      <Navbar
        isAuthenticated
        isSidebarCollapsed
        onToggleSidebar={jest.fn()}
      />,
    );

    expect(screen.getByRole('button', { name: 'Expand sidebar' })).toBeInTheDocument();

    rerender(
      <Navbar
        isAuthenticated={false}
        isSidebarCollapsed
        onToggleSidebar={jest.fn()}
      />,
    );

    expect(screen.queryByRole('button', { name: 'Expand sidebar' })).not.toBeInTheDocument();
  });
});
