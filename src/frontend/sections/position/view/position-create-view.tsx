"use client";

import Container from "@mui/material/Container";

import { paths } from "@/routes/paths";

import { useSettingsContext } from "@/components/settings";
import CustomBreadcrumbs from "@/components/custom-breadcrumbs";

import PositionNewEditForm from "../position-new-edit-form";

// ----------------------------------------------------------------------

export default function PositionCreateView() {
  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : "lg"}>
      <CustomBreadcrumbs
        heading="役職/役割マスタ作成"
        links={[
          { name: "ダッシュボード", href: paths.admin.dashboard },
          {
            name: "役職/役割マスタ",
            href: paths.admin.position.root,
          },
          { name: "役職/役割を作成" },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <PositionNewEditForm />
    </Container>
  );
}
