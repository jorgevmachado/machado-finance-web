import { AccountDetailPage } from '@/app/modules/finance';

type AccountDetailRouterPageProps = Readonly<{
  params: Promise<{
    identifier: string;
  }>;
}>;

export default async function AccountDetailRouterPage({ params }: AccountDetailRouterPageProps) {
  const { identifier }  = await params;

  return (
    <AccountDetailPage identifier={identifier} />
  );
}
