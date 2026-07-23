import type { ActionState } from '@/app/shared/actions';

const mockReadRegisterPayload = jest.fn();
const mockValidateRegisterPayload = jest.fn();
const mockMapRegisterError = jest.fn();
const mockRegister = jest.fn();

jest.mock('./validation', () => ({
  readRegisterPayload: (...args: Array<unknown>) => mockReadRegisterPayload(...args),
  validateRegisterPayload: (...args: Array<unknown>) => mockValidateRegisterPayload(...args),
  mapRegisterError: (...args: Array<unknown>) => mockMapRegisterError(...args),
}));

jest.mock('../../api/service', () => ({
  authService: () => ({
    register: (...args: Array<unknown>) => mockRegister(...args),
  }),
}));

import { registerAction } from './register';



describe('registerAction', () => {
  const initialState: ActionState = {
    type: 'other',
    status: 'idle',
    message: '',
  };

  const validPayload = {
    name: 'John Doe',
    email: 'user@example.com',
    username: 'johndoe',
    password: 'Secure@123',
    confirmPassword: 'Secure@123',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns validation error without calling service', async () => {
    const validationError: ActionState = {
      type: 'other',
      status: 'error',
      message: 'invalid',
    };

    mockReadRegisterPayload.mockReturnValue(validPayload);
    mockValidateRegisterPayload.mockReturnValue(validationError);

    const result = await registerAction(initialState, new FormData());

    expect(result).toEqual(validationError);
    expect(mockRegister).not.toHaveBeenCalled();
  });

  it('registers in, and returns success on valid input', async () => {
    mockReadRegisterPayload.mockReturnValue({
      name: 'John Doe',
      email: 'user@example.com',
      username: 'johndoe',
      password: 'Secure@123',
      confirmPassword: 'Secure@123',
    });
    mockValidateRegisterPayload.mockReturnValue(null);
    mockRegister.mockResolvedValue({
      type: 'create',
      status: 'success',
      message: 'Successfully registered',
    });

    await registerAction(initialState, new FormData());

    expect(mockRegister).toHaveBeenCalledWith({
      name: 'John Doe',
      email: 'user@example.com',
      username: 'johndoe',
      password: 'Secure@123'
    });
  });

  it('maps and returns service errors', async () => {
    const mappedError: ActionState = {
      type: 'other',
      status: 'error',
      message: 'register failed',
    };
    const thrownError = new Error('boom');

    mockReadRegisterPayload.mockReturnValue({
      name: 'John Doe',
      email: 'user@example.com',
      username: 'johndoe',
      password: 'Secure@123',
      confirmPassword: 'Secure@123',
    });
    mockValidateRegisterPayload.mockReturnValue(null);
    mockRegister.mockRejectedValue(thrownError);
    mockMapRegisterError.mockReturnValue(mappedError);

    const result = await registerAction(initialState, new FormData());

    expect(mockMapRegisterError).toHaveBeenCalledWith(thrownError);
    expect(result).toEqual(mappedError);
  });
});
