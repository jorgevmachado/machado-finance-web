import { NextRequest ,NextResponse } from 'next/server';

import { getServerSession } from '@/app/modules/auth/server';
import { financeService } from '@/app/modules/finance';

export async function POST(request: NextRequest): Promise<NextResponse> {
  const session = await getServerSession();

  if (!session.isAuthenticated || !session.token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const payload = await request.json();
    const response = await financeService(session.token).expense.persistList(payload);
    return NextResponse.json(response);
  } catch (error) {
    console.log('# => error => ', error);
    const message = error instanceof Error && error.message ? error.message : 'Could not Persist list Expense.';
    const status = error instanceof Error && (error as { statusCode?: number}).statusCode ? (error as { statusCode?: number}).statusCode : 500;
    return NextResponse.json({ message }, { status });
  }
}