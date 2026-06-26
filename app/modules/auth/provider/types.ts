import React from 'react';

import { TUser } from '../types';

export type UserContextValue = {
  user?: TUser;
  isLoading: boolean;
  clearUser: () => void;
  refreshUser: () => Promise<TUser | undefined>;
  isAuthenticated: boolean;
};

export type UserProviderProps = {
  children: React.ReactNode;
  initialUser?: TUser;
  tokenExpiresAt?: number;
  isAuthenticated: boolean;

};