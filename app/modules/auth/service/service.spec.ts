import { AuthService } from './service';

describe('AuthService', () => {
  it('posts credentials to login endpoint and returns extracted token', async () => {
    const service = new AuthService('http://api.test');
    const postSpy = jest
      .spyOn(service, 'post')
      .mockResolvedValue({ token_type: 'Bearer', access_token: 'jwt-token' });

    const token = await service.login({
      credential: 'user@example.com',
      password: 'Secure@123',
    });

    expect(postSpy).toHaveBeenCalledWith('auth/login', {
      body: {
        credential: 'user@example.com',
        password: 'Secure@123',
      },
    });
    expect(token).toBe('jwt-token');
  });

  it('gets authenticated user from /me endpoint', async () => {
    const service = new AuthService('http://api.test', 'jwt-token');
    const getSpy = jest.spyOn(service, 'get').mockResolvedValue({
      id: '1',
      email: 'user@example.com',
      name: 'John Doe',
      role: 'USER',
      status: 'ACTIVE',
      username: 'johndoe',
    });

    const user = await service.me();

    expect(getSpy).toHaveBeenCalledWith('auth/me');
    expect(user).toEqual({
      id: '1',
      email: 'user@example.com',
      name: 'John Doe',
      role: 'USER',
      status: 'ACTIVE',
      username: 'johndoe',
    });
  });

  it('posts payload to register endpoint', async () => {
    const service = new AuthService('http://api.test');
    const postSpy = jest.spyOn(service, 'post').mockResolvedValue({
      id: '1',
      name: 'John Doe',
      email: 'user@example.com',
      status: 'ACTIVE',
    });

    const response = await service.register({
      name: 'John Doe',
      email: 'user@example.com',
      username: 'johndoe',
      password: 'Secure@123',
    });

    expect(postSpy).toHaveBeenCalledWith('auth/register', {
      body: {
        name: 'John Doe',
        email: 'user@example.com',
        username: 'johndoe',
        password: 'Secure@123',
      },
    });
    expect(response).toEqual({
      id: '1',
      name: 'John Doe',
      email: 'user@example.com',
      status: 'ACTIVE',
    });
  });
});
