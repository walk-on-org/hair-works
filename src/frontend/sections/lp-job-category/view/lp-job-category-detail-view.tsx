"use client";

import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";

import { paths } from "@/routes/paths";
import { RouterLink } from "@/routes/components";

import { useGetLpJobCategory } from "@/api/lp-job-category";

import Label from "@/components/label";
import CustomBreadcrumbs from "@/components/custom-breadcrumbs";
import Iconify from "@/components/iconify";
import EmptyContent from "@/components/empty-content";
import { useSettingsContext } from "@/components/settings";

import LpJobCategoryDetailToolbar from "../lp-job-category-detail-toolbar";
import { LpJobCategoryDetailSkeleton } from "../lp-job-category-skelton";

// ----------------------------------------------------------------------

type Props = {
  id: string;
};

export default function LpJobCategoryDetailView({ id }: Props) {
  const { lpJobCategory, lpJobCategoryLoading, lpJobCategoryError } =
    useGetLpJobCategory(id);

  const settings = useSettingsContext();

  const renderSkeleton = <LpJobCategoryDetailSkeleton />;

  const renderError = (
    <EmptyContent
      filled
      title={`${lpJobCategoryError?.message}`}
      action={
        <Button
          component={RouterLink}
          href={paths.admin.lpJobCategory.root}
          startIcon={<Iconify icon="eva:arrow-ios-back-fill" width={16} />}
          sx={{ mt: 3 }}
        >
          一覧へ戻る
        </Button>
      }
      sx={{ py: 10 }}
    />
  );

  const renderLpJobCategory = lpJobCategory && (
    <>
      <CustomBreadcrumbs
        heading="LP職種マスタ詳細"
        links={[
          { name: "ダッシュボード", href: paths.admin.dashboard },
          {
            name: "LP職種マスタ",
            href: paths.admin.lpJobCategory.root,
          },
          { name: lpJobCategory?.name },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <LpJobCategoryDetailToolbar
        backLink={paths.admin.lpJobCategory.root}
        editLink={paths.admin.lpJobCategory.edit(`${lpJobCategory?.id}`)}
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
            <Typography variant="subtitle2" sx={{ width: 160 }}>
              LP職種名
            </Typography>
            <Typography variant="body2" sx={{ flexGrow: 1 }}>
              {lpJobCategory.name}
            </Typography>
          </Stack>

          <Stack
            direction={{
              xs: "column",
              md: "row",
            }}
            rowGap={1}
          >
            <Typography variant="subtitle2" sx={{ width: 160 }}>
              状態
            </Typography>
            <Label
              variant="soft"
              color={(lpJobCategory.status == "1" && "info") || "default"}
              width="fit-content"
            >
              {lpJobCategory.status_name}
            </Label>
          </Stack>
        </Stack>
      </Card>
    </>
  );

  return (
    <Container maxWidth={settings.themeStretch ? false : "lg"}>
      {lpJobCategoryLoading && renderSkeleton}

      {lpJobCategoryError && renderError}

      {lpJobCategory && renderLpJobCategory}
    </Container>
  );
}
