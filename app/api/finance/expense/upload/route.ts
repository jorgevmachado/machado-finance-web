import { NextRequest ,NextResponse } from 'next/server';

import { getServerSession } from '@/app/modules/auth/server';
import { financeService, TExpenseUpload } from '@/app/modules/finance';
import { EBank } from '@/app/modules/finance/bank';

export async function POST(request: NextRequest): Promise<NextResponse> {
  const session = await getServerSession();

  if (!session.isAuthenticated || !session.token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file');
    const bank = formData.get('bank');
    const allocationId = formData.get('allocation_id');

    if (
      !(file instanceof File) ||
      typeof bank !== 'string' ||
      !Object.values(EBank).includes(bank as EBank) ||
      typeof allocationId !== 'string'
    ) {
      return NextResponse.json({ message: 'Invalid upload payload.' }, { status: 400 });
    }

    const payload: TExpenseUpload = {
      file,
      bank: bank as EBank,
      allocation_id: allocationId,
    };

    const response = await financeService(session.token).expense.upload(payload);
    return NextResponse.json(response);
  } catch (error) {
    const message = error instanceof Error && error.message ? error.message : 'Could not upload Expense.';
    const status = error instanceof Error && (error as { statusCode?: number}).statusCode ? (error as { statusCode?: number}).statusCode : 500;
    return NextResponse.json({ message }, { status });
  }
}
