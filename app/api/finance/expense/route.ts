import { NextRequest ,NextResponse } from 'next/server';

import { getServerSession } from '@/app/modules/auth/server';
import { financeService } from '@/app/modules/finance';

export async function GET(request: NextRequest): Promise<NextResponse> {
  const session = await getServerSession();

  if (!session.isAuthenticated || !session.token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const params = Object.fromEntries(request.nextUrl.searchParams.entries());
    const response = await financeService(session.token).expense.list(params);
    return NextResponse.json(response);
  } catch (error) {
    const message = error instanceof Error && error.message ? error.message : 'Could not load Expense.';
    const status = error instanceof Error && (error as { statusCode?: number}).statusCode ? (error as { statusCode?: number}).statusCode : 500;
    return NextResponse.json({ message }, { status });
  }
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  const session = await getServerSession();

  if (!session.isAuthenticated || !session.token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const payload = await request.json();
    const response = await financeService(session.token).expense.create(payload);
    return NextResponse.json(response);
  } catch (error) {
    const message = error instanceof Error && error.message ? error.message : 'Could not create Expense.';
    const status = error instanceof Error && (error as { statusCode?: number}).statusCode ? (error as { statusCode?: number}).statusCode : 500;
    return NextResponse.json({ message }, { status });
  }
}