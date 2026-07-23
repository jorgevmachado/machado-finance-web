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
  createI18nMessage: (key: string) => `i18n:${key}`,
  useAppTranslation: () => ({
    t: (key: string) => key,
  }),
  translateI18nMessage: (_t: (key: string) => string, message?: string) =>
    `translated:${message}`,
}));

jest.mock('@/app/shared/actions/state', () => ({
  INITIAL_ACTION_STATE: { status: 'idle', type: 'other', message: '' },
}));

jest.mock('@/app/modules/auth/actions', () => ({
  registerAction: jest.fn(),
}));

import RegisterPage from './RegisterPage';

describe('RegisterPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders default register form', () => {
    mockUseActionState.mockReturnValue([
      { status: 'idle', message: '' },
      jest.fn(),
      false,
    ]);

    render(<RegisterPage />);

    expect(screen.getByText('auth.register.form.title')).toBeInTheDocument();
    expect(screen.getByLabelText('auth.register.form.label.name')).toBeInTheDocument();
    expect(screen.getByLabelText('auth.register.form.label.email')).toBeInTheDocument();
    expect(screen.getByLabelText('auth.register.form.label.username')).toBeInTheDocument();
    expect(screen.getByLabelText('auth.register.form.label.password')).toBeInTheDocument();
    expect(screen.getByLabelText('auth.register.form.label.confirm_password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'auth.register.form.submit' })).toBeInTheDocument();
    expect(screen.queryByText(/translated:/)).not.toBeInTheDocument();
  });

  it('renders translated error and pending submit label', () => {
    mockUseActionState.mockReturnValue([
      { status: 'error', message: 'i18n:auth.register.message.error.default' },
      jest.fn(),
      true,
    ]);

    render(<RegisterPage />);

    expect(
      screen.getByText('translated:i18n:auth.register.message.error.default'),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'auth.register.form.submitting' }),
    ).toBeDisabled();
  });
});
