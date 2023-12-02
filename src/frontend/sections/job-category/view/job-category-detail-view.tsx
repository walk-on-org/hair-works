"use client";

import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";

import { paths } from "@/routes/paths";
import { RouterLink } from "@/routes/components";

import { useGetJobCategory } from "@/api/job-category";

import Label from "@/components/label";
import CustomBreadcrumbs from "@/components/custom-breadcrumbs";
import Iconify from "@/components/iconify";
import EmptyContent from "@/components/empty-content";
import { useSettingsContext } from "@/components/settings";

import JobCategoryDetailToolbar from "../job-category-detail-toolbar";
import { JobCategoryDetailsSkeleton } from "../job-category-skelton";

// ----------------------------------------------------------------------

type Props = {
  id: string;
};

export default function ProductDetailsView({ id }: Props) {
  const { jobCategory, jobCategoryLoading, jobCategoryError } =
    useGetJobCategory(id);

  const settings = useSettingsContext();

  const renderSkeleton = <JobCategoryDetailsSkeleton />;

  const renderError = (
    <EmptyContent
      filled
      title={`${jobCategoryError?.message}`}
      action={
        <Button
          component={RouterLink}
          href={paths.admin.jobCategory.root}
          startIcon={<Iconify icon="eva:arrow-ios-back-fill" width={16} />}
          sx={{ mt: 3 }}
        >
          一覧へ戻る
        </Button>
      }
      sx={{ py: 10 }}
    />
  );

  const renderJobCategory = jobCategory && (
    <>
      <CustomBreadcrumbs
        heading="職種マスタ詳細"
        links={[
          { name: "ダッシュボード", href: paths.admin.dashboard },
          {
            name: "職種マスタ",
            href: paths.admin.jobCategory.root,
          },
          { name: jobCategory?.name },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <JobCategoryDetailToolbar
        backLink={paths.admin.jobCategory.root}
        editLink={paths.admin.jobCategory.edit(`${jobCategory?.id}`)}
      />

      <Card>
        <Stack spacing={3} sx={{ p: 3 }}>
          <Stack direction="row">
            <Typography variant="subtitle2" sx={{ width: 160 }}>
              職種名
            </Typography>
            <Typography variant="body2" sx={{ flexGrow: 1 }}>
              {jobCategory.name}
            </Typography>
          </Stack>

          <Stack direction="row">
            <Typography variant="subtitle2" sx={{ width: 160 }}>
              パーマリンク
            </Typography>
            <Typography variant="body2" sx={{ flexGrow: 1 }}>
              {jobCategory.permalink}
            </Typography>
          </Stack>

          <Stack direction="row">
            <Typography variant="subtitle2" sx={{ width: 160 }}>
              状態
            </Typography>
            <Label
              variant="soft"
              color={(jobCategory.status == "1" && "info") || "default"}
            >
              {jobCategory.status == "1" ? "有効" : "無効"}
            </Label>
          </Stack>
        </Stack>
      </Card>
    </>
  );

  return (
    <Container maxWidth={settings.themeStretch ? false : "lg"}>
      {jobCategoryLoading && renderSkeleton}

      {jobCategoryError && renderError}

      {jobCategory && renderJobCategory}
    </Container>
  );
}
