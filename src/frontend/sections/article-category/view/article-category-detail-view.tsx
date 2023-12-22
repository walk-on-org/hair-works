"use client";

import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";

import { paths } from "@/routes/paths";
import { RouterLink } from "@/routes/components";

import { useGetArticleCategory } from "@/api/article-category";

import Label from "@/components/label";
import CustomBreadcrumbs from "@/components/custom-breadcrumbs";
import Iconify from "@/components/iconify";
import EmptyContent from "@/components/empty-content";
import { useSettingsContext } from "@/components/settings";

import ArticleCategoryDetailToolbar from "../article-category-detail-toolbar";
import { ArticleCategoryDetailSkeleton } from "../article-category-skelton";

// ----------------------------------------------------------------------

type Props = {
  id: string;
};

export default function ArticleCategoryDetailView({ id }: Props) {
  const { articleCategory, articleCategoryLoading, articleCategoryError } =
    useGetArticleCategory(id);

  const settings = useSettingsContext();

  const renderSkeleton = <ArticleCategoryDetailSkeleton />;

  const renderError = (
    <EmptyContent
      filled
      title={`${articleCategoryError?.message}`}
      action={
        <Button
          component={RouterLink}
          href={paths.admin.articleCategory.root}
          startIcon={<Iconify icon="eva:arrow-ios-back-fill" width={16} />}
          sx={{ mt: 3 }}
        >
          一覧へ戻る
        </Button>
      }
      sx={{ py: 10 }}
    />
  );

  const renderArticleCategory = articleCategory && (
    <>
      <CustomBreadcrumbs
        heading="特集記事カテゴリ詳細"
        links={[
          { name: "ダッシュボード", href: paths.admin.dashboard },
          {
            name: "特集記事カテゴリ",
            href: paths.admin.articleCategory.root,
          },
          { name: articleCategory?.name },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <ArticleCategoryDetailToolbar
        backLink={paths.admin.articleCategory.root}
        editLink={paths.admin.articleCategory.edit(`${articleCategory?.id}`)}
      />

      <Card>
        <Stack spacing={3} sx={{ p: 3 }}>
          <Stack direction="row">
            <Typography variant="subtitle2" sx={{ width: 160 }}>
              特集記事カテゴリ名
            </Typography>
            <Typography variant="body2" sx={{ flexGrow: 1 }}>
              {articleCategory.name}
            </Typography>
          </Stack>

          <Stack direction="row">
            <Typography variant="subtitle2" sx={{ width: 160 }}>
              パーマリンク
            </Typography>
            <Typography variant="body2" sx={{ flexGrow: 1 }}>
              {articleCategory.permalink}
            </Typography>
          </Stack>

          <Stack direction="row">
            <Typography variant="subtitle2" sx={{ width: 160 }}>
              状態
            </Typography>
            <Label
              variant="soft"
              color={(articleCategory.status == "1" && "info") || "default"}
            >
              {articleCategory.status_name}
            </Label>
          </Stack>
        </Stack>
      </Card>
    </>
  );

  return (
    <Container maxWidth={settings.themeStretch ? false : "lg"}>
      {articleCategoryLoading && renderSkeleton}

      {articleCategoryError && renderError}

      {articleCategory && renderArticleCategory}
    </Container>
  );
}
