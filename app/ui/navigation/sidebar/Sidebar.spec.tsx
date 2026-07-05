import { fireEvent, render, screen } from '@testing-library/react';
import { MdCatchingPokemon, MdHome } from 'react-icons/md';

jest.mock('@/app/shared', () => ({
  useAppTranslation: () => ({
    t: (key: string, options?: { section?: string }) => {
      if (key === 'navigation.expandSection') return `Expand ${options?.section}`;
      if (key === 'navigation.collapseSection') return `Collapse ${options?.section}`;
      if (key === 'navigation.signOut') return 'Sign out';
      if (key === 'navigation.sidebar') return 'Sidebar';
      if (key === 'navigation.authenticatedNavigation') return 'Authenticated navigation';
      return key;
    },
  }),
}));

import Sidebar from './Sidebar';
import type { TMenuItem } from '../types';

const items: Array<TMenuItem> = [
  { label: 'Home', roles: ['USER', 'ADMIN'], href: '/home', icon: MdHome },
  {
    label: 'Pokemon',
    href: '/pokemon',
    icon: MdCatchingPokemon,
    roles: ['USER', 'ADMIN'],
    children: [
      { label: 'Types', roles: ['USER', 'ADMIN'], href: '/pokemon/type', icon: MdCatchingPokemon },
      { label: 'Abilities', roles: ['USER', 'ADMIN'], href: '/pokemon/ability', icon: MdCatchingPokemon },
      { label: 'Moves', roles: ['USER', 'ADMIN'], href: '/pokemon/move', icon: MdCatchingPokemon },
    ],
  },
];

describe('Sidebar', () => {
  const renderSidebar = (pathname: string, isCollapsed = false, onLogout = jest.fn()) => {
    return render(<Sidebar items={items} isCollapsed={isCollapsed} pathname={pathname} onLogout={onLogout} />);
  };

  it('keeps Pokemon parent link navigable and expands children with arrow', () => {
    renderSidebar('/home');

    expect(screen.getByRole('link', { name: /pokemon/i })).toHaveAttribute('href', '/pokemon');
    expect(screen.queryByRole('link', { name: /types/i })).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Expand Pokemon' }));

    expect(screen.getByRole('link', { name: /types/i })).toHaveAttribute('href', '/pokemon/type');
    expect(screen.getByRole('link', { name: /abilities/i })).toHaveAttribute('href', '/pokemon/ability');
    expect(screen.getByRole('link', { name: /moves/i })).toHaveAttribute('href', '/pokemon/move');
  });

  it('auto-expands Pokemon children for child routes', () => {
    renderSidebar('/pokemon/move/tackle');

    expect(screen.getByRole('button', { name: 'Collapse Pokemon' })).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('link', { name: /moves/i })).toHaveAttribute('aria-current', 'page');
  });

  it('continues rendering existing top-level links', () => {
    renderSidebar('/home');

    expect(screen.getByRole('link', { name: /home/i })).toHaveAttribute('href', '/home');
    expect(screen.getByRole('button', { name: 'Sign out' })).toBeInTheDocument();
  });

  it('uses titles and hides labels when collapsed', () => {
    const onLogout = jest.fn();

    renderSidebar('/home', true, onLogout);

    expect(screen.getByTitle('Home')).toHaveAttribute('href', '/home');
    expect(screen.getByTitle('Pokemon')).toHaveAttribute('href', '/pokemon');
    expect(screen.queryByRole('button', { name: 'Expand Pokemon' })).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Sign out' }));

    expect(onLogout).toHaveBeenCalledTimes(1);
  });
});
