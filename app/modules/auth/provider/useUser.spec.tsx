import React from 'react';

import { renderHook } from '@testing-library/react';

import { UserContext } from './UserContext';
import { useUser } from './useUser';

describe('useUser', () => {
  it('throws when used outside UserProvider', () => {
    expect(() => renderHook(() => useUser())).toThrow(
      'useUser must be used within a UserProvider.',
    );
  });

  it('returns context value when provider exists', () => {
    const value = {
      user: {
        id: '1',
        email: 'user@example.com',
        name: 'John Doe',
        role: 'USER',
        status: 'ACTIVE',
        username: 'johndoe',
      },
      isLoading: false,
      clearUser: jest.fn(),
      refreshUser: jest.fn(async () => undefined),
      isAuthenticated: true,
    };

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <UserContext.Provider value={value}>{children}</UserContext.Provider>
    );

    const { result } = renderHook(() => useUser(), { wrapper });

    expect(result.current).toEqual(value);
  });
});
