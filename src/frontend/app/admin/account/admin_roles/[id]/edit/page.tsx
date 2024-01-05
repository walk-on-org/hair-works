import { AdminRoleEditView } from "@/sections/admin-role/view";

// ----------------------------------------------------------------------

export const metadata = {
  title: "管理者ロール編集",
};

type Props = {
  params: {
    id: string;
  };
};

export default function AdminRoleEditPage({ params }: Props) {
  const { id } = params;

  return <AdminRoleEditView id={id} />;
}
