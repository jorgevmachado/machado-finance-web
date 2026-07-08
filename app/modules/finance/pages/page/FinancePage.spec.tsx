import { fireEvent, render, screen } from '@testing-library/react';
import type React from 'react';

import FinancePage from './FinancePage';

const mockPush = jest.fn();
const mockUseUser = jest.fn();
const mockStartContentLoading = jest.fn();
const mockStopContentLoading = jest.fn();
const mockShowAlert = jest.fn();
const mockOnboarding = jest.fn().mockResolvedValue({
  error: false,
  i18nMessageSuccess: 'finance.onboarding.success',
});

jest.mock('@/app/ds', () => ({
  Button: ({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
    <button {...props}>{children}</button>
  ),
  Card: ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
    <div {...props}>{children}</div>
  ),
  Text: ({ children, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p {...props}>{children}</p>
  ),
  useLoading: () => ({
    startContentLoading: mockStartContentLoading,
    stopContentLoading: mockStopContentLoading,
  }),
  useAlert: () => ({
    showAlert: mockShowAlert,
  }),
}));

jest.mock('@/app/modules/auth', () => ({
  useUser: () => mockUseUser(),
}));

jest.mock('@/app/modules/finance', () => ({
  financeBffService: {
    onboarding: () => mockOnboarding(),
  },
}));

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

describe('FinancePage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('shows empty state when user has no finance and triggers onboarding', () => {
    mockUseUser.mockReturnValue({
      user: {
        id: 'user-1',
        name: 'Jorge',
      },
    });

    render(<FinancePage />);

    expect(screen.getByText('Você ainda não possui uma finança criada')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Inicializar finança' })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Inicializar finança' }));
    expect(mockOnboarding).toHaveBeenCalled();
  });

  it('shows mocked finance summary when user already has finance', () => {
    mockUseUser.mockReturnValue({
      user: {
        id: 'user-1',
        name: 'Jorge',
        finance: {
          id: 'finance-1',
          user_id: 'user-1',
          accounts: [{ id: 'acc-1' }],
          allocations: [],
        },
      },
    });

    render(<FinancePage />);

    expect(screen.getByText('Olá, Jorge')).toBeInTheDocument();
    expect(screen.getByText('Saldo atual')).toBeInTheDocument();
    expect(screen.getByText('Receitas do mês')).toBeInTheDocument();
    expect(screen.getByText('Despesas do mês')).toBeInTheDocument();
    expect(screen.getByText('Meta de economia')).toBeInTheDocument();
    expect(screen.getByText('R$ 8.432,54')).toBeInTheDocument();
    expect(screen.getByText('R$ 12.450,23')).toBeInTheDocument();
    expect(screen.getByText('R$ 4.017,69')).toBeInTheDocument();
    expect(screen.getByText('32%')).toBeInTheDocument();
  });

  it('shows account creation empty state when finance exists but accounts are empty', () => {
    mockUseUser.mockReturnValue({
      user: {
        id: 'user-1',
        name: 'Jorge',
        finance: {
          id: 'finance-1',
          user_id: 'user-1',
          accounts: [],
          allocations: [],
        },
      },
    });

    render(<FinancePage />);

    expect(screen.getByText('Você precisa criar uma conta primeiro')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Criar conta' })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Criar conta' }));
    expect(mockPush).toHaveBeenCalledWith('/acccounts');
  });
});
