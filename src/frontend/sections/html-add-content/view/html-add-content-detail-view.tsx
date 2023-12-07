"use client";

import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";

import { paths } from "@/routes/paths";
import { RouterLink } from "@/routes/components";

import { useGetHtmlAddContent } from "@/api/html-add-content";

import Label from "@/components/label";
import CustomBreadcrumbs from "@/components/custom-breadcrumbs";
import Iconify from "@/components/iconify";
import EmptyContent from "@/components/empty-content";
import { useSettingsContext } from "@/components/settings";
import Markdown from "@/components/markdown";

import HtmlAddContentDetailToolbar from "../html-add-content-detail-toolbar";
import { HtmlAddContentDetailSkeleton } from "../html-add-content-skelton";

// ----------------------------------------------------------------------

type Props = {
  id: string;
};

export default function HtmlAddContentDetailView({ id }: Props) {
  const { htmlAddContent, htmlAddContentLoading, htmlAddContentError } =
    useGetHtmlAddContent(id);

  const settings = useSettingsContext();

  const renderSkeleton = <HtmlAddContentDetailSkeleton />;

  const renderError = (
    <EmptyContent
      filled
      title={`${htmlAddContentError?.message}`}
      action={
        <Button
          component={RouterLink}
          href={paths.admin.htmlAddContent.root}
          startIcon={<Iconify icon="eva:arrow-ios-back-fill" width={16} />}
          sx={{ mt: 3 }}
        >
          一覧へ戻る
        </Button>
      }
      sx={{ py: 10 }}
    />
  );

  const renderHtmlAddContent = htmlAddContent && (
    <>
      <CustomBreadcrumbs
        heading="HTML追加コンテンツ詳細"
        links={[
          { name: "ダッシュボード", href: paths.admin.dashboard },
          {
            name: "HTML追加コンテンツ",
            href: paths.admin.htmlAddContent.root,
          },
          { name: `# ${htmlAddContent?.id}` },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <HtmlAddContentDetailToolbar
        backLink={paths.admin.htmlAddContent.root}
        editLink={paths.admin.htmlAddContent.edit(`${htmlAddContent?.id}`)}
      />

      <Card>
        <Stack spacing={3} sx={{ p: 3 }}>
          <Stack direction="row">
            <Typography variant="subtitle2" sx={{ width: 160 }}>
              都道府県
            </Typography>
            <Typography variant="body2" sx={{ flexGrow: 1 }}>
              {htmlAddContent.prefecture_name}
            </Typography>
          </Stack>

          <Stack direction="row">
            <Typography variant="subtitle2" sx={{ width: 160 }}>
              政令指定都市
            </Typography>
            <Typography variant="body2" sx={{ flexGrow: 1 }}>
              {htmlAddContent.government_city_name}
            </Typography>
          </Stack>

          <Stack direction="row">
            <Typography variant="subtitle2" sx={{ width: 160 }}>
              市区町村
            </Typography>
            <Typography variant="body2" sx={{ flexGrow: 1 }}>
              {htmlAddContent.city_name}
            </Typography>
          </Stack>

          <Stack direction="row">
            <Typography variant="subtitle2" sx={{ width: 160 }}>
              駅
            </Typography>
            <Typography variant="body2" sx={{ flexGrow: 1 }}>
              {htmlAddContent.station_name}
            </Typography>
          </Stack>

          <Stack direction="row">
            <Typography variant="subtitle2" sx={{ width: 160 }}>
              平均給与表示フラグ
            </Typography>
            <Label
              variant="soft"
              color={
                (htmlAddContent.display_average_salary == "1" && "info") ||
                "default"
              }
            >
              {htmlAddContent.display_average_salary_name}
            </Label>
          </Stack>

          <Stack direction="row">
            <Typography variant="subtitle2" sx={{ width: 160 }}>
              特徴表示フラグ
            </Typography>
            <Label
              variant="soft"
              color={
                (htmlAddContent.display_feature == "1" && "info") || "default"
              }
            >
              {htmlAddContent.display_feature_name}
            </Label>
          </Stack>

          <Stack direction="row">
            <Typography variant="subtitle2" sx={{ width: 160 }}>
              特徴
            </Typography>
            <Markdown
              children={htmlAddContent.feature}
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
      {htmlAddContentLoading && renderSkeleton}

      {htmlAddContentError && renderError}

      {htmlAddContent && renderHtmlAddContent}
    </Container>
  );
}
