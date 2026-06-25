import { getServerSession } from '@/app/modules/auth/server';
import { redirect } from 'next/navigation';

export default async function RootPage() {
  const session = await getServerSession();

  if (session.isAuthenticated) {
    redirect('/home');
  }

  redirect('/login');
}
