import React from 'react';

import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';

const mockPush = jest.fn();
const mockRefresh = jest.fn();
const mockFetch = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: (...args: Array<unknown>) => mockPush(...args),
    refresh: (...args: Array<unknown>) => mockRefresh(...args),
  }),
}));

import UserProvider from './UserProvider';
import { useUser } from './useUser';

const Consumer = () => {
  const { user, isLoading, isAuthenticated, refreshUser, clearUser } = useUser();

  return (
    <div>
      <span data-testid='email'>{user?.email ?? ''}</span>
      <span data-testid='loading'>{String(isLoading)}</span>
      <span data-testid='authenticated'>{String(isAuthenticated)}</span>
      <button
        type='button'
        onClick={() => {
          void refreshUser();
        }}
      >
        refresh
      </button>
      <button type='button' onClick={clearUser}>
        clear
      </button>
    </div>
  );
};

describe('UserProvider', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = mockFetch as unknown as typeof fetch;
  });

  it('does not request user when not authenticated', async () => {
    render(
      <UserProvider isAuthenticated={false}>
        <Consumer />
      </UserProvider>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'refresh' }));

    await waitFor(() => {
      expect(mockFetch).not.toHaveBeenCalled();
    });
    expect(screen.getByTestId('authenticated')).toHaveTextContent('false');
  });

  it('refreshes user successfully when API returns valid user', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({
        id: '1',
        email: 'user@example.com',
        name: 'John Doe',
      }),
    });

    render(
      <UserProvider isAuthenticated>
        <Consumer />
      </UserProvider>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'refresh' }));

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('/api/auth/me', {
        method: 'GET',
        cache: 'no-store',
      });
    });
    await waitFor(() => {
      expect(screen.getByTestId('email')).toHaveTextContent('user@example.com');
    });
    expect(screen.getByTestId('authenticated')).toHaveTextContent('true');
  });

  it('invalidates session on unauthorized response', async () => {
    mockFetch.mockResolvedValue({
      ok: false,
      status: 401,
      json: async () => ({ message: 'unauthorized' }),
    });

    render(
      <UserProvider isAuthenticated>
        <Consumer />
      </UserProvider>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'refresh' }));

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/login');
      expect(mockRefresh).toHaveBeenCalled();
    });
    expect(screen.getByTestId('email')).toHaveTextContent('');
  });

  it('clears user when API returns non-user payload with successful status', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => 'invalid-user-payload',
    });

    render(
      <UserProvider
        isAuthenticated
        initialUser={{
          id: '1',
          email: 'initial@example.com',
          name: 'Initial User',
          role: 'USER',
          status: 'ACTIVE',
          username: 'initial',
        }}
      >
        <Consumer />
      </UserProvider>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'refresh' }));

    await waitFor(() => {
      expect(screen.getByTestId('email')).toHaveTextContent('');
    });
    expect(screen.getByTestId('loading')).toHaveTextContent('false');
  });

  it('clears user when request throws', async () => {
    mockFetch.mockRejectedValue(new Error('network error'));

    render(
      <UserProvider
        isAuthenticated
        initialUser={{
          id: '1',
          email: 'initial@example.com',
          name: 'Initial User',
          role: 'USER',
          status: 'ACTIVE',
          username: 'initial',
        }}
      >
        <Consumer />
      </UserProvider>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'refresh' }));

    await waitFor(() => {
      expect(screen.getByTestId('email')).toHaveTextContent('');
    });
    expect(screen.getByTestId('loading')).toHaveTextContent('false');
  });

  it('invalidates expired token immediately', async () => {
    jest.useFakeTimers();

    render(
      <UserProvider
        isAuthenticated
        tokenExpiresAt={Date.now() - 1000}
      >
        <Consumer />
      </UserProvider>,
    );

    await act(async () => {
      jest.runAllTimers();
    });

    expect(mockPush).toHaveBeenCalledWith('/login');
    expect(mockRefresh).toHaveBeenCalled();

    jest.useRealTimers();
  });

  it('invalidates session when future token timeout is reached', async () => {
    jest.useFakeTimers();

    render(
      <UserProvider
        isAuthenticated
        tokenExpiresAt={Date.now() + 5_000}
      >
        <Consumer />
      </UserProvider>,
    );

    await act(async () => {
      jest.advanceTimersByTime(5_001);
    });

    expect(mockPush).toHaveBeenCalledWith('/login');
    expect(mockRefresh).toHaveBeenCalled();

    jest.useRealTimers();
  });

  it('refreshes user on focus and visibility change events', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({
        id: '1',
        email: 'user@example.com',
        name: 'John Doe',
      }),
    });

    const visibilityDescriptor = Object.getOwnPropertyDescriptor(
      Document.prototype,
      'visibilityState',
    );

    Object.defineProperty(Document.prototype, 'visibilityState', {
      configurable: true,
      get: () => 'visible',
    });

    render(
      <UserProvider isAuthenticated>
        <Consumer />
      </UserProvider>,
    );

    act(() => {
      globalThis.dispatchEvent(new Event('focus'));
      document.dispatchEvent(new Event('visibilitychange'));
    });

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledTimes(2);
    });

    if (visibilityDescriptor) {
      Object.defineProperty(
        Document.prototype,
        'visibilityState',
        visibilityDescriptor,
      );
    }
  });

  it('does not refresh user on visibility change when tab is not visible', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({
        id: '1',
        email: 'user@example.com',
        name: 'John Doe',
      }),
    });

    const visibilityDescriptor = Object.getOwnPropertyDescriptor(
      Document.prototype,
      'visibilityState',
    );

    Object.defineProperty(Document.prototype, 'visibilityState', {
      configurable: true,
      get: () => 'hidden',
    });

    render(
      <UserProvider isAuthenticated>
        <Consumer />
      </UserProvider>,
    );

    act(() => {
      document.dispatchEvent(new Event('visibilitychange'));
    });

    await waitFor(() => {
      expect(mockFetch).not.toHaveBeenCalled();
    });

    if (visibilityDescriptor) {
      Object.defineProperty(
        Document.prototype,
        'visibilityState',
        visibilityDescriptor,
      );
    }
  });

  it('clears scheduled timeout on unmount when token expiration is in the future', () => {
    jest.useFakeTimers();
    const clearTimeoutSpy = jest.spyOn(globalThis, 'clearTimeout');

    const { unmount } = render(
      <UserProvider
        isAuthenticated
        tokenExpiresAt={Date.now() + 5_000}
      >
        <Consumer />
      </UserProvider>,
    );

    unmount();

    expect(clearTimeoutSpy).toHaveBeenCalled();

    clearTimeoutSpy.mockRestore();
    jest.useRealTimers();
  });
});
