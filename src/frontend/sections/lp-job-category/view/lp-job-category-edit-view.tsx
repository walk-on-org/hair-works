"use client";

import Container from "@mui/material/Container";

import { paths } from "@/routes/paths";

import { useGetLpJobCategory } from "@/api/lp-job-category";

import { useSettingsContext } from "@/components/settings";
import CustomBreadcrumbs from "@/components/custom-breadcrumbs";

import LpJobCategoryNewEditForm from "../lp-job-category-new-edit-form";

// ----------------------------------------------------------------------

type Props = {
  id: string;
};

export default function LpJobCategoryEditView({ id }: Props) {
  const settings = useSettingsContext();

  const { lpJobCategory: currentLpJobCategory } = useGetLpJobCategory(id);

  return (
    <Container maxWidth={settings.themeStretch ? false : "lg"}>
      <CustomBreadcrumbs
        heading="LP職種マスタ編集"
        links={[
          { name: "ダッシュボード", href: paths.admin.dashboard },
          {
            name: "LP職種マスタ",
            href: paths.admin.lpJobCategory.root,
          },
          { name: currentLpJobCategory?.name },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <LpJobCategoryNewEditForm currentLpJobCategory={currentLpJobCategory} />
    </Container>
  );
}
