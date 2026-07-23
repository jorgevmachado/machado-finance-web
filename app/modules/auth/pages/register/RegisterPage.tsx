'use client';
import { useActionState } from 'react';
import Link from 'next/link';

import { translateI18nMessage ,useAppTranslation } from '@/app/shared';

import { Button ,Text } from '@/app/ds';

import { registerAction } from '@/app/modules/auth/actions';

import { INITIAL_ACTION_STATE } from '@/app/shared/actions/state';

export default function RegisterPage() {
  const [state, formAction, isPending] = useActionState(registerAction, INITIAL_ACTION_STATE);
  const { t } = useAppTranslation();

  if (state.status === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-md p-8 text-center">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">{t('auth.register.form.success.title')}</h2>
          <p className="text-gray-500 text-sm mb-6">{translateI18nMessage(t, state.message)}</p>
          <Link
            href="/login"
            className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-6 rounded-lg text-sm transition-colors"
          >
            {t('auth.register.form.success.action')}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-md p-8">
        <Text weight="bold" size="2xl" color="text-gray-900" className="mb-2">{t('auth.register.form.title')}</Text>
        <Text size="sm" color="text-gray-500" className="mb-6">{t('auth.register.form.subtitle')}</Text>
        <form action={formAction} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              {t('auth.register.form.label.name')}
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              autoComplete="username"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder={t('auth.register.form.placeholder.name')}
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              {t('auth.register.form.label.email')}
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder={t('auth.register.form.placeholder.email')}
            />
          </div>

          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
              {t('auth.register.form.label.username')}
            </label>
            <input
              id="username"
              name="username"
              type="text"
              required
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder={t('auth.register.form.placeholder.username')}
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              {t('auth.register.form.label.password')}
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="new-password"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder={t('auth.register.form.placeholder.password')}
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
              {t('auth.register.form.label.confirm_password')}
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              autoComplete="new-password"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder={t('auth.register.form.placeholder.confirm_password')}
            />
          </div>

          {state.status === 'error' && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              {translateI18nMessage(t, state.message)}
            </p>
          )}

          <Button
            type="submit"
            disabled={isPending}
            className="w-full py-2 px-4"
          >
            {isPending ? t('auth.register.form.submitting') : t('auth.register.form.submit')}
          </Button>
        </form>
        <Text size="sm" color="text-gray-500" className="text-center">
          {t('auth.register.form.redirect.description')}{' '}
          <Link href="/login" className="text-indigo-600 hover:underline font-medium">
            {t('auth.register.form.redirect.link')}
          </Link>
        </Text>
      </div>
    </div>
  );
}