"use client";

import Container from "@mui/material/Container";

import { paths } from "@/routes/paths";

import { useGetArticleCategories } from "@/api/article-category";
import { useGetCommitmentTerms } from "@/api/commitment-term";
import { useGetPositions } from "@/api/position";

import { useSettingsContext } from "@/components/settings";
import CustomBreadcrumbs from "@/components/custom-breadcrumbs";

import ArticleNewEditForm from "../article-new-edit-form";

// ----------------------------------------------------------------------

export default function ArticleCreateView() {
  const settings = useSettingsContext();

  const { articleCategories } = useGetArticleCategories();
  const { positions } = useGetPositions();
  const { commitmentTerms } = useGetCommitmentTerms();

  return (
    <Container maxWidth={settings.themeStretch ? false : "lg"}>
      <CustomBreadcrumbs
        heading="特集記事作成"
        links={[
          { name: "ダッシュボード", href: paths.admin.dashboard },
          {
            name: "特集記事",
            href: paths.admin.article.root,
          },
          { name: "特集記事を作成" },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <ArticleNewEditForm
        articleCategories={articleCategories}
        commitmentTerms={commitmentTerms}
        positions={positions}
      />
    </Container>
  );
}
