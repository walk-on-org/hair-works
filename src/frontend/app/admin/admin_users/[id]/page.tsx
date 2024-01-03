import { AdminUserDetailView } from "@/sections/admin-user/view";

// ----------------------------------------------------------------------

export const metadata = {
  title: "管理者ユーザ詳細",
};

type Props = {
  params: {
    id: string;
  };
};

export default function AdminUserDetailPage({ params }: Props) {
  const { id } = params;

  return <AdminUserDetailView id={id} />;
}
