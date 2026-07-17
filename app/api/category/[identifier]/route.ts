import { NextRequest ,NextResponse } from 'next/server';

import { categoryService } from '@/app/modules/category';

import { BaseRouter ,RouteContext } from '../base';

const categoryRouter = new BaseRouter(categoryService, 'Category');

export async function DELETE(
  _: NextRequest,
  context: RouteContext
): Promise<NextResponse> {
  return categoryRouter.delete(context);
}

export async function PUT(
  request: NextRequest,
  context: RouteContext
): Promise<NextResponse> {
  return categoryRouter.update(request, context);
}