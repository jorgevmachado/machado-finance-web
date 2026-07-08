import { fireEvent, render, screen } from '@testing-library/react';

import PersistIncome from './PersistIncome';

jest.mock('@/app/shared', () => ({
  ...jest.requireActual('@/app/shared'),
  useAppTranslation: () => ({
    t: (key: string) => key,
  }),
}));

describe('PersistIncome', () => {
  it('renders source, description and monthly amount/date inputs', () => {
    const onClose = jest.fn();

    const { container } = render(<PersistIncome onClose={onClose} />);

    expect(screen.getByLabelText('income.source')).toBeInTheDocument();
    expect(screen.getByLabelText('form.descriptionLabel')).toBeInTheDocument();
    expect(screen.getAllByText('reference_day')).toHaveLength(12);
    expect(container.querySelector('input#january-amount')).toBeInTheDocument();
    expect(container.querySelector('input#january-reference-day')).toBeInTheDocument();
    expect(container.querySelector('input#december-amount')).toBeInTheDocument();
    expect(container.querySelector('input#december-reference-day')).toBeInTheDocument();
  });

  it('updates source, description and month values', () => {
    const onClose = jest.fn();

    const { container } = render(<PersistIncome onClose={onClose} />);

    const sourceInput = screen.getByLabelText('income.source');
    const descriptionInput = screen.getByLabelText('form.descriptionLabel');
    const januaryAmountInput = container.querySelector('input#january-amount') as HTMLInputElement;
    const januaryReferenceDayInput = container.querySelector('input#january-reference-day') as HTMLInputElement;

    fireEvent.change(sourceInput, { target: { value: 'Salary' } });
    fireEvent.change(descriptionInput, { target: { value: 'Fixed monthly income' } });
    fireEvent.change(januaryAmountInput, { target: { value: '1000' } });
    fireEvent.change(januaryReferenceDayInput, { target: { value: '2026-01-10' } });

    expect(sourceInput).toHaveValue('Salary');
    expect(descriptionInput).toHaveValue('Fixed monthly income');
    expect(januaryAmountInput).toHaveValue('R$ 10,00');
    expect(januaryReferenceDayInput).toHaveValue('2026-01-10');
  });
});
