"use client";

import Container from "@mui/material/Container";

import { paths } from "@/routes/paths";

import { useSettingsContext } from "@/components/settings";
import CustomBreadcrumbs from "@/components/custom-breadcrumbs";

import AdminRoleNewEditForm from "../admin-role-new-edit-form";

// ----------------------------------------------------------------------

export default function AdminRoleCreateView() {
  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : "lg"}>
      <CustomBreadcrumbs
        heading="管理者ロール作成"
        links={[
          { name: "ダッシュボード", href: paths.admin.dashboard },
          {
            name: "管理者ロール",
            href: paths.admin.adminRole.root,
          },
          { name: "管理者ロールを作成" },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <AdminRoleNewEditForm />
    </Container>
  );
}
