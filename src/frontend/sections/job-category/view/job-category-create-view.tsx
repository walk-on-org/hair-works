"use client";

import Container from "@mui/material/Container";

import { paths } from "@/routes/paths";

import { useSettingsContext } from "@/components/settings";
import CustomBreadcrumbs from "@/components/custom-breadcrumbs";

import JobCategoryNewEditForm from "../job-category-new-edit-form";

// ----------------------------------------------------------------------

export default function JobCategoryCreateView() {
  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : "lg"}>
      <CustomBreadcrumbs
        heading="職種マスタ作成"
        links={[
          { name: "ダッシュボード", href: paths.admin.dashboard },
          {
            name: "職種マスタ",
            href: paths.admin.jobCategory.root,
          },
          { name: "職種を作成" },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <JobCategoryNewEditForm />
    </Container>
  );
}
