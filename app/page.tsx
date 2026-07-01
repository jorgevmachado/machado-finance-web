import { redirect } from 'next/navigation';

import { getServerSession } from '@/app/modules/auth/server';

export default async function RootPage() {
  const session = await getServerSession();

  if (session.isAuthenticated) {
    redirect('/home');
  }

  redirect('/login');
}
