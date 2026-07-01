import React from 'react';
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';

import { I18nProvider } from '@/app/shared';
import { AlertProvider ,BreadcrumbProvider ,LoadingProvider } from '@/app/ds';
import { NavigationFrame } from '@/app/ui';

import './globals.css';
import { getAuthenticatedUserBootstrap, getServerSession } from '@/app/modules/auth/server';

import { UserProvider } from '@/app/modules/auth';



const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Machado',
  description: '%s | Machado',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession();
  const { initialUser, tokenExpiresAt } = await getAuthenticatedUserBootstrap(
    session.isAuthenticated,
    session.token,
  );
  const isAuthenticated = session.isAuthenticated && Boolean(initialUser);
  return (
    <html
      lang='en'
      className={`${geistSans.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      <body className='antialiased'>
        <I18nProvider>
          <AlertProvider>
            <UserProvider
              key={session.token || 'guest-session'}
              initialUser={initialUser}
              isAuthenticated={isAuthenticated}
              tokenExpiresAt={isAuthenticated ? tokenExpiresAt : undefined}
            >
              <LoadingProvider>
                <BreadcrumbProvider>
                  <NavigationFrame isAuthenticated={isAuthenticated} role={initialUser?.role}>
                    {children}
                  </NavigationFrame>
                </BreadcrumbProvider>
              </LoadingProvider>
            </UserProvider>
          </AlertProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
