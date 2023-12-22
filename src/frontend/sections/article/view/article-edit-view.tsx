"use client";

import Container from "@mui/material/Container";

import { paths } from "@/routes/paths";

import { useGetArticle } from "@/api/article";
import { useGetArticleCategories } from "@/api/article-category";
import { useGetCommitmentTerms } from "@/api/commitment-term";
import { useGetPositions } from "@/api/position";

import { useSettingsContext } from "@/components/settings";
import CustomBreadcrumbs from "@/components/custom-breadcrumbs";

import ArticleNewEditForm from "../article-new-edit-form";

// ----------------------------------------------------------------------

type Props = {
  id: string;
};

export default function ArticleEditView({ id }: Props) {
  const settings = useSettingsContext();

  const { article: currentArticle } = useGetArticle(id);
  const { articleCategories } = useGetArticleCategories();
  const { commitmentTerms } = useGetCommitmentTerms();
  const { positions } = useGetPositions();

  return (
    <Container maxWidth={settings.themeStretch ? false : "lg"}>
      <CustomBreadcrumbs
        heading="特集記事編集"
        links={[
          { name: "ダッシュボード", href: paths.admin.dashboard },
          {
            name: "特集記事",
            href: paths.admin.article.root,
          },
          { name: currentArticle?.title },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <ArticleNewEditForm
        currentArticle={currentArticle}
        articleCategories={articleCategories}
        commitmentTerms={commitmentTerms}
        positions={positions}
      />
    </Container>
  );
}
