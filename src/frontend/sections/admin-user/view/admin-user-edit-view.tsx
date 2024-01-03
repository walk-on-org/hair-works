"use client";

import Container from "@mui/material/Container";

import { paths } from "@/routes/paths";

import { useGetAdminUser } from "@/api/admin-user";
import { useGetAdminRoles } from "@/api/admin-role";
import { useGetCorporations } from "@/api/corporation";

import { useSettingsContext } from "@/components/settings";
import CustomBreadcrumbs from "@/components/custom-breadcrumbs";

import AdminUserNewEditForm from "../admin-user-new-edit-form";

// ----------------------------------------------------------------------

type Props = {
  id: string;
};

export default function AdminUserEditView({ id }: Props) {
  const settings = useSettingsContext();

  const { adminUser: currentAdminUser } = useGetAdminUser(id);
  const { adminRoles } = useGetAdminRoles();
  const { corporations } = useGetCorporations();

  return (
    <Container maxWidth={settings.themeStretch ? false : "lg"}>
      <CustomBreadcrumbs
        heading="管理者ユーザ編集"
        links={[
          { name: "ダッシュボード", href: paths.admin.dashboard },
          {
            name: "管理者ユーザ",
            href: paths.admin.adminUser.root,
          },
          { name: currentAdminUser?.name },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <AdminUserNewEditForm
        currentAdminUser={currentAdminUser}
        adminRoles={adminRoles}
        corporations={corporations}
      />
    </Container>
  );
}
