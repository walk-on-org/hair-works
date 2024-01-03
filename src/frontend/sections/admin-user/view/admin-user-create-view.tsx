"use client";

import Container from "@mui/material/Container";

import { paths } from "@/routes/paths";

import { useSettingsContext } from "@/components/settings";
import CustomBreadcrumbs from "@/components/custom-breadcrumbs";

import AdminUserNewEditForm from "../admin-user-new-edit-form";
import { useGetAdminRoles } from "@/api/admin-role";
import { useGetCorporations } from "@/api/corporation";

// ----------------------------------------------------------------------

export default function AdminUserCreateView() {
  const settings = useSettingsContext();

  const { adminRoles } = useGetAdminRoles();
  const { corporations } = useGetCorporations();

  return (
    <Container maxWidth={settings.themeStretch ? false : "lg"}>
      <CustomBreadcrumbs
        heading="管理者ユーザ作成"
        links={[
          { name: "ダッシュボード", href: paths.admin.dashboard },
          {
            name: "管理者ユーザ",
            href: paths.admin.adminUser.root,
          },
          { name: "管理者ユーザを作成" },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <AdminUserNewEditForm
        adminRoles={adminRoles}
        corporations={corporations}
      />
    </Container>
  );
}
