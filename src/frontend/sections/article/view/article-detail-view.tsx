"use client";

import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";

import { paths } from "@/routes/paths";
import { RouterLink } from "@/routes/components";

import { useGetArticle } from "@/api/article";

import Image from "@/components/image";
import Label from "@/components/label";
import CustomBreadcrumbs from "@/components/custom-breadcrumbs";
import Iconify from "@/components/iconify";
import EmptyContent from "@/components/empty-content";
import { useSettingsContext } from "@/components/settings";
import Markdown from "@/components/markdown";

import ArticleDetailToolbar from "../article-detail-toolbar";
import { ArticleDetailSkeleton } from "../article-skelton";
import { fCurrency } from "@/utils/format-number";

// ----------------------------------------------------------------------

type Props = {
  id: string;
};

export default function ArticleDetailView({ id }: Props) {
  const { article, articleLoading, articleError } = useGetArticle(id);
  const settings = useSettingsContext();

  const renderSkeleton = <ArticleDetailSkeleton />;

  const renderError = (
    <EmptyContent
      filled
      title={`${articleError?.message}`}
      action={
        <Button
          component={RouterLink}
          href={paths.admin.article.root}
          startIcon={<Iconify icon="eva:arrow-ios-back-fill" width={16} />}
          sx={{ mt: 3 }}
        >
          一覧へ戻る
        </Button>
      }
      sx={{ py: 10 }}
    />
  );

  const renderArticle = article && (
    <>
      <CustomBreadcrumbs
        heading="特集記事詳細"
        links={[
          { name: "ダッシュボード", href: paths.admin.dashboard },
          {
            name: "特集記事",
            href: paths.admin.article.root,
          },
          { name: article?.title },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <ArticleDetailToolbar
        backLink={paths.admin.article.root}
        editLink={paths.admin.article.edit(`${article?.id}`)}
        previewLink="TODO"
      />

      <Card>
        <Stack spacing={3} sx={{ p: 2 }}>
          <Stack
            direction={{
              xs: "column",
              md: "row",
            }}
            rowGap={1}
          >
            <Typography variant="subtitle2" sx={{ width: 240 }}>
              特殊記事ID
            </Typography>
            <Typography variant="body2" sx={{ flexGrow: 1 }}>
              {article.id}
            </Typography>
          </Stack>

          <Stack
            direction={{
              xs: "column",
              md: "row",
            }}
            rowGap={1}
          >
            <Typography variant="subtitle2" sx={{ width: 240 }}>
              タイトル
            </Typography>
            <Typography variant="body2" sx={{ flexGrow: 1 }}>
              {article.title}
            </Typography>
          </Stack>

          <Stack
            direction={{
              xs: "column",
              md: "row",
            }}
            rowGap={1}
          >
            <Typography variant="subtitle2" sx={{ width: 240 }}>
              説明
            </Typography>
            <Typography variant="body2" sx={{ flexGrow: 1 }}>
              {article.description}
            </Typography>
          </Stack>

          <Stack
            direction={{
              xs: "column",
              md: "row",
            }}
            rowGap={1}
          >
            <Typography variant="subtitle2" sx={{ width: 240 }}>
              特集記事カテゴリ
            </Typography>
            <Typography variant="body2" sx={{ flexGrow: 1 }}>
              {article.article_category_name}
            </Typography>
          </Stack>

          <Stack
            direction={{
              xs: "column",
              md: "row",
            }}
            rowGap={1}
          >
            <Typography variant="subtitle2" sx={{ width: 240 }}>
              パーマリンク
            </Typography>
            <Typography variant="body2" sx={{ flexGrow: 1 }}>
              {article.permalink}
            </Typography>
          </Stack>

          <Stack
            direction={{
              xs: "column",
              md: "row",
            }}
            rowGap={1}
          >
            <Typography variant="subtitle2" sx={{ width: 240 }}>
              状態
            </Typography>
            <Label
              variant="soft"
              color={
                (article.status == "1" && "info") ||
                (article.status == "2" && "warning") ||
                "default"
              }
              width="fit-content"
            >
              {article.status_name}
            </Label>
          </Stack>

          <Stack
            direction={{
              xs: "column",
              md: "row",
            }}
            rowGap={1}
          >
            <Typography variant="subtitle2" sx={{ width: 240 }}>
              メイン画像
            </Typography>
            <Image src={article.main_image} />
          </Stack>

          <Stack
            direction={{
              xs: "column",
              md: "row",
            }}
            rowGap={1}
          >
            <Typography variant="subtitle2" sx={{ width: 240 }}>
              共通CTA追加
            </Typography>
            <Label
              variant="soft"
              color={(article.add_cta == "1" && "info") || "default"}
              width="fit-content"
            >
              {article.add_cta_name}
            </Label>
          </Stack>

          <Stack
            direction={{
              xs: "column",
              md: "row",
            }}
            rowGap={1}
          >
            <Typography variant="subtitle2" sx={{ width: 240 }}>
              関連こだわり条件
            </Typography>
            <Typography variant="body2" sx={{ flexGrow: 1 }}>
              {article.commitment_term_name}
            </Typography>
          </Stack>

          <Stack
            direction={{
              xs: "column",
              md: "row",
            }}
            rowGap={1}
          >
            <Typography variant="subtitle2" sx={{ width: 240 }}>
              関連役職/役割
            </Typography>
            <Typography variant="body2" sx={{ flexGrow: 1 }}>
              {article.position_name}
            </Typography>
          </Stack>

          <Stack
            direction={{
              xs: "column",
              md: "row",
            }}
            rowGap={1}
          >
            <Typography variant="subtitle2" sx={{ width: 240 }}>
              関連月給下限
            </Typography>
            <Typography variant="body2" sx={{ flexGrow: 1 }}>
              {article.m_salary_lower
                ? `${fCurrency(article.m_salary_lower)}円`
                : ""}
            </Typography>
          </Stack>

          <Stack
            direction={{
              xs: "column",
              md: "row",
            }}
            rowGap={1}
          >
            <Typography variant="subtitle2" sx={{ width: 240 }}>
              本文
            </Typography>
            <Markdown
              children={article.content}
              sx={{
                p: 3,
                "& p, li, ol": {
                  typography: "body2",
                },
                "& ol": {
                  p: 0,
                  display: { md: "flex" },
                  listStyleType: "none",
                  "& li": {
                    "&:first-of-type": {
                      minWidth: 240,
                      mb: { xs: 0.5, md: 0 },
                    },
                  },
                },
              }}
            />
          </Stack>
        </Stack>
      </Card>
    </>
  );

  return (
    <Container maxWidth={settings.themeStretch ? false : "lg"}>
      {articleLoading && renderSkeleton}

      {articleError && renderError}

      {article && renderArticle}
    </Container>
  );
}
