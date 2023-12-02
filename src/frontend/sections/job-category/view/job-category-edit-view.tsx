"use client";

import Container from "@mui/material/Container";

import { paths } from "@/routes/paths";

import { useGetJobCategory } from "@/api/job-category";

import { useSettingsContext } from "@/components/settings";
import CustomBreadcrumbs from "@/components/custom-breadcrumbs";

import JobCategoryNewEditForm from "../job-category-new-edit-form";

// ----------------------------------------------------------------------

type Props = {
  id: string;
};

export default function JobCategoryEditView({ id }: Props) {
  const settings = useSettingsContext();

  const { jobCategory: currentJobCategory } = useGetJobCategory(id);

  return (
    <Container maxWidth={settings.themeStretch ? false : "lg"}>
      <CustomBreadcrumbs
        heading="職種マスタ編集"
        links={[
          { name: "ダッシュボード", href: paths.admin.dashboard },
          {
            name: "職種マスタ",
            href: paths.admin.jobCategory.root,
          },
          { name: currentJobCategory?.name },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <JobCategoryNewEditForm currentJobCategory={currentJobCategory} />
    </Container>
  );
}
