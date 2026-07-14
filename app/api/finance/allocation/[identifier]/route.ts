import { NextRequest ,NextResponse } from 'next/server';

import { getServerSession } from '@/app/modules/auth/server';
import { financeService } from '@/app/modules/finance';

type IncomeRouteContext = {
  params: Promise<{
    identifier: string;
  }>;
};

export async function DELETE(
  _: NextRequest,
  context: IncomeRouteContext
): Promise<NextResponse> {
  const session = await getServerSession();

  if (!session.isAuthenticated || !session.token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { identifier } = await context.params;
    const response = await financeService(session.token).allocation.delete(identifier);
    return NextResponse.json(response);
  } catch (error) {
    const message = error instanceof Error && error.message ? error.message : 'Could not delete Allocation.';
    return NextResponse.json({ message }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  context: IncomeRouteContext
): Promise<NextResponse> {
  const session = await getServerSession();

  if (!session.isAuthenticated || !session.token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { identifier } = await context.params;
    const payload = await request.json();
    const response = await financeService(session.token).allocation.update(identifier, payload);
    return NextResponse.json(response);
  } catch (error) {
    const message = error instanceof Error && error.message ? error.message : 'Could not update Allocation.';
    return NextResponse.json({ message }, { status: 500 });
  }
}