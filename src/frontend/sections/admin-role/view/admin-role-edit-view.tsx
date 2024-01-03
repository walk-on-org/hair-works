"use client";

import Container from "@mui/material/Container";

import { paths } from "@/routes/paths";

import { useGetAdminRole } from "@/api/admin-role";

import { useSettingsContext } from "@/components/settings";
import CustomBreadcrumbs from "@/components/custom-breadcrumbs";

import AdminRoleNewEditForm from "../admin-role-new-edit-form";

// ----------------------------------------------------------------------

type Props = {
  id: string;
};

export default function AdminRoleEditView({ id }: Props) {
  const settings = useSettingsContext();

  const { adminRole: currentAdminRole } = useGetAdminRole(id);

  return (
    <Container maxWidth={settings.themeStretch ? false : "lg"}>
      <CustomBreadcrumbs
        heading="管理者ロール編集"
        links={[
          { name: "ダッシュボード", href: paths.admin.dashboard },
          {
            name: "管理者ロール",
            href: paths.admin.adminRole.root,
          },
          { name: currentAdminRole?.name },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <AdminRoleNewEditForm currentAdminRole={currentAdminRole} />
    </Container>
  );
}
