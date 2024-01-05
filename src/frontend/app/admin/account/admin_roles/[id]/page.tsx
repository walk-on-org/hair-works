import { AdminRoleDetailView } from "@/sections/admin-role/view";

// ----------------------------------------------------------------------

export const metadata = {
  title: "管理者ロール詳細",
};

type Props = {
  params: {
    id: string;
  };
};

export default function AdminRoleDetailPage({ params }: Props) {
  const { id } = params;

  return <AdminRoleDetailView id={id} />;
}
