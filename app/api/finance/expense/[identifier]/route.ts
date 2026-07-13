import { NextRequest ,NextResponse } from 'next/server';

import { getServerSession } from '@/app/modules/auth/server';
import { financeService } from '@/app/modules/finance';

type ExpenseRouteContext = {
  params: Promise<{
    identifier: string;
  }>;
};

export async function GET(
  request: NextRequest,
  context: ExpenseRouteContext
): Promise<NextResponse> {
  const session = await getServerSession();

  if (!session.isAuthenticated || !session.token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { identifier } = await context.params;
    const params = Object.fromEntries(request.nextUrl.searchParams.entries());
    const response = await financeService(session.token).expense.detail(identifier, params);
    return NextResponse.json(response);
  } catch (error) {
    const message = error instanceof Error && error.message ? error.message : 'Could not load Expense.';
    return NextResponse.json({ message }, { status: 500 });
  }
}

export async function DELETE(
  _: NextRequest,
  context: ExpenseRouteContext
): Promise<NextResponse> {
  const session = await getServerSession();

  if (!session.isAuthenticated || !session.token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { identifier } = await context.params;
    const response = await financeService(session.token).expense.delete(identifier);
    return NextResponse.json(response);
  } catch (error) {
    const message = error instanceof Error && error.message ? error.message : 'Could not delete Expense.';
    const status = error instanceof Error && (error as { statusCode?: number}).statusCode ? (error as { statusCode?: number}).statusCode : 500;
    return NextResponse.json({ message }, { status });
  }
}

export async function PUT(
  request: NextRequest,
  context: ExpenseRouteContext
): Promise<NextResponse> {
  const session = await getServerSession();

  if (!session.isAuthenticated || !session.token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { identifier } = await context.params;
    const payload = await request.json();
    const response = await financeService(session.token).expense.update(identifier, payload);
    return NextResponse.json(response);
  } catch (error) {
    const message = error instanceof Error && error.message ? error.message : 'Could not update Expense.';
    const status = error instanceof Error && (error as { statusCode?: number}).statusCode ? (error as { statusCode?: number}).statusCode : 500;
    return NextResponse.json({ message }, { status });
  }
}