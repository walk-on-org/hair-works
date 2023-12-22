"use client";

import Container from "@mui/material/Container";

import { paths } from "@/routes/paths";

import { useSettingsContext } from "@/components/settings";
import CustomBreadcrumbs from "@/components/custom-breadcrumbs";

import ArticleCategoryNewEditForm from "../article-category-new-edit-form";

// ----------------------------------------------------------------------

export default function ArticleCategoryCreateView() {
  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : "lg"}>
      <CustomBreadcrumbs
        heading="特集記事カテゴリ作成"
        links={[
          { name: "ダッシュボード", href: paths.admin.dashboard },
          {
            name: "特集記事カテゴリ",
            href: paths.admin.articleCategory.root,
          },
          { name: "特集記事カテゴリを作成" },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <ArticleCategoryNewEditForm />
    </Container>
  );
}
