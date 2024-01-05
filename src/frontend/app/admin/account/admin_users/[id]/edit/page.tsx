import { AdminUserEditView } from "@/sections/admin-user/view";

// ----------------------------------------------------------------------

export const metadata = {
  title: "管理者ユーザ編集",
};

type Props = {
  params: {
    id: string;
  };
};

export default function AdminUserEditPage({ params }: Props) {
  const { id } = params;

  return <AdminUserEditView id={id} />;
}
