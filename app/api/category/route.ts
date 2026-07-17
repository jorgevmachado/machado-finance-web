import { NextRequest, NextResponse } from 'next/server';

import { categoryService } from '@/app/modules/category';
import { BaseRouter } from './base';

const categoryRouter = new BaseRouter(categoryService, 'Category');

export async function GET(request: NextRequest): Promise<NextResponse> {
  return categoryRouter.list(request);
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  return categoryRouter.create(request);
}
