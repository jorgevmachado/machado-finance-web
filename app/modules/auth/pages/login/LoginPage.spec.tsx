import React from 'react';

import { render, screen } from '@testing-library/react';

const mockUseActionState = jest.fn();

jest.mock('react', () => {
  const actual = jest.requireActual('react');
  return {
    ...actual,
    useActionState: (...args: Array<unknown>) => mockUseActionState(...args),
  };
});

jest.mock('next/link', () => {
  // eslint-disable-next-line react/display-name
  return ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  );
});

jest.mock('@/app/ds', () => ({
  Text: ({ children }: { children: React.ReactNode }) => <span>{children}</span>,
  Button: ({
    children,
    disabled,
    type,
    className,
  }: {
    children: React.ReactNode;
    disabled?: boolean;
    type?: 'button' | 'submit' | 'reset';
    className?: string;
  }) => (
    <button type={type} disabled={disabled} className={className}>
      {children}
    </button>
  ),
}));

jest.mock('@/app/shared', () => ({
  ...jest.requireActual('@/app/shared'),
  createI18nMessage: (key: string) => `i18n:${key}`,
  useAppTranslation: () => ({
    t: (key: string) => key,
  }),
  translateI18nMessage: (_t: (key: string) => string, message?: string) =>
    `translated:${message}`,
}));

import LoginPage from './LoginPage';

describe('LoginPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders default login form', () => {
    mockUseActionState.mockReturnValue([
      { status: 'idle', message: '' },
      jest.fn(),
      false,
    ]);

    render(<LoginPage />);

    expect(screen.getByText('auth.login.title')).toBeInTheDocument();
    expect(screen.getByLabelText('auth.login.credentialLabel')).toBeInTheDocument();
    expect(screen.getByLabelText('auth.login.passwordLabel')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'auth.login.submit' })).toBeInTheDocument();
    expect(screen.queryByText(/translated:/)).not.toBeInTheDocument();
  });

  it('renders translated error and pending submit label', () => {
    mockUseActionState.mockReturnValue([
      { status: 'error', message: 'i18n:auth.errors.invalidCredential' },
      jest.fn(),
      true,
    ]);

    render(<LoginPage />);

    expect(
      screen.getByText('translated:i18n:auth.errors.invalidCredential'),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'auth.login.submitting' }),
    ).toBeDisabled();
  });
});
