"use client";

import Container from "@mui/material/Container";

import { paths } from "@/routes/paths";

import { useSettingsContext } from "@/components/settings";
import CustomBreadcrumbs from "@/components/custom-breadcrumbs";

import CustomLpNewEditForm from "../custom-lp-new-edit-form";

// ----------------------------------------------------------------------

export default function CustomLpCreateView() {
  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : "lg"}>
      <CustomBreadcrumbs
        heading="専用LP設定作成"
        links={[
          { name: "ダッシュボード", href: paths.admin.dashboard },
          {
            name: "専用LP設定",
            href: paths.admin.customLp.root,
          },
          { name: "専用LP設定を作成" },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <CustomLpNewEditForm />
    </Container>
  );
}
