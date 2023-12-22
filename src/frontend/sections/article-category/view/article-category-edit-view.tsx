"use client";

import Container from "@mui/material/Container";

import { paths } from "@/routes/paths";

import { useGetArticleCategory } from "@/api/article-category";

import { useSettingsContext } from "@/components/settings";
import CustomBreadcrumbs from "@/components/custom-breadcrumbs";

import ArticleCategoryNewEditForm from "../article-category-new-edit-form";

// ----------------------------------------------------------------------

type Props = {
  id: string;
};

export default function ArticleCategoryEditView({ id }: Props) {
  const settings = useSettingsContext();

  const { articleCategory: currentArticleCategory } = useGetArticleCategory(id);

  return (
    <Container maxWidth={settings.themeStretch ? false : "lg"}>
      <CustomBreadcrumbs
        heading="特集記事カテゴリ編集"
        links={[
          { name: "ダッシュボード", href: paths.admin.dashboard },
          {
            name: "特集記事カテゴリ",
            href: paths.admin.articleCategory.root,
          },
          { name: currentArticleCategory?.name },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <ArticleCategoryNewEditForm
        currentArticleCategory={currentArticleCategory}
      />
    </Container>
  );
}
