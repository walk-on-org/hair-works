"use client";

import Container from "@mui/material/Container";

import { paths } from "@/routes/paths";

import { useSettingsContext } from "@/components/settings";
import CustomBreadcrumbs from "@/components/custom-breadcrumbs";

import QualificationNewEditForm from "../qualification-new-edit-form";

// ----------------------------------------------------------------------

export default function QualificationCreateView() {
  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : "lg"}>
      <CustomBreadcrumbs
        heading="保有資格マスタ作成"
        links={[
          { name: "ダッシュボード", href: paths.admin.dashboard },
          {
            name: "保有資格マスタ",
            href: paths.admin.qualification.root,
          },
          { name: "保有資格を作成" },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <QualificationNewEditForm />
    </Container>
  );
}
