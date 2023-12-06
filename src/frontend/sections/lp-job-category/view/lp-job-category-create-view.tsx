"use client";

import Container from "@mui/material/Container";

import { paths } from "@/routes/paths";

import { useSettingsContext } from "@/components/settings";
import CustomBreadcrumbs from "@/components/custom-breadcrumbs";

import LpJobCategoryNewEditForm from "../lp-job-category-new-edit-form";

// ----------------------------------------------------------------------

export default function LpJobCategoryCreateView() {
  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : "lg"}>
      <CustomBreadcrumbs
        heading="LP職種マスタ作成"
        links={[
          { name: "ダッシュボード", href: paths.admin.dashboard },
          {
            name: "LP職種マスタ",
            href: paths.admin.lpJobCategory.root,
          },
          { name: "LP職種を作成" },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <LpJobCategoryNewEditForm />
    </Container>
  );
}
