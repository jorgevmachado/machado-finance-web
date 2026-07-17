import { NextRequest, NextResponse } from 'next/server';

import { getServerSession } from '@/app/modules/auth/server';

import { ApiBaseServiceAbstract ,ResponseError } from '@/app/shared';
import { validateValue } from '@/app/utils';

type TServiceFactory = (token?: string) => ApiBaseServiceAbstract<unknown, unknown, unknown>;

type TCrud = 'create' | 'list' | 'update' | 'delete';

export type RouteContext = {
  params: Promise<{
    identifier: string;
  }>;
};

export class BaseRouter {
  constructor(
    private readonly serviceFactory: TServiceFactory,
    private readonly domain: string,
  ) {}

  private async getToken(): Promise<string | undefined> {
    const session = await getServerSession();
    if (!session.isAuthenticated || !session.token) {
      return;
    }

    return session.token;
  }

  private responseError(error: unknown, type: TCrud): NextResponse {
    const defaultMessage = `Could not ${type} ${this.domain}.`;
    const defaultStatus = 500;
    if (error instanceof Error) {
      const message = validateValue(error.message) ? error.message : defaultMessage;
      return NextResponse.json({ message }, { status: defaultStatus });
    }
    const internalResponseError = error as ResponseError;


    const status = internalResponseError?.statusCode ? internalResponseError.statusCode : defaultStatus;
    const message = internalResponseError?.message ? internalResponseError.message : defaultMessage;
    return NextResponse.json({ message, detail: message }, { status });
  }

  async list(request: NextRequest): Promise<NextResponse> {
    const token = await this.getToken();

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
      const params = Object.fromEntries(request.nextUrl.searchParams.entries());
      const response = await this.serviceFactory(token).list(params);
      return NextResponse.json(response);
    } catch (error) {
      return this.responseError(error, 'list');
    }
  }

  async create(request: NextRequest): Promise<NextResponse> {
    const token = await this.getToken();

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
      const payload = await request.json();
      const response = await this.serviceFactory(token).create(payload);
      return NextResponse.json(response);
    } catch (error) {
      return this.responseError(error, 'create');
    }
  }

  async update(request: NextRequest, context: RouteContext): Promise<NextResponse> {
    const token = await this.getToken();

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
      const { identifier } = await context.params;
      const payload = await request.json();
      const response = await this.serviceFactory(token).update(identifier, payload);
      return NextResponse.json(response);
    } catch (error) {
      return this.responseError(error, 'update');
    }
  }

  async delete(context: RouteContext): Promise<NextResponse> {
    const token = await this.getToken();

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
      const { identifier } = await context.params;
      const response = await this.serviceFactory(token).delete(identifier);
      return NextResponse.json(response);
    } catch (error) {
      return this.responseError(error, 'delete');
    }
  }
}