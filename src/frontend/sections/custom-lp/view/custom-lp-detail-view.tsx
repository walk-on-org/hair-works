"use client";

import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";

import { paths } from "@/routes/paths";
import { RouterLink } from "@/routes/components";

import { useGetCustomLp } from "@/api/custom-lp";

import Label from "@/components/label";
import CustomBreadcrumbs from "@/components/custom-breadcrumbs";
import Iconify from "@/components/iconify";
import EmptyContent from "@/components/empty-content";
import { useSettingsContext } from "@/components/settings";

import CustomLpDetailToolbar from "../custom-lp-detail-toolbar";
import { CustomLpDetailSkeleton } from "../custom-lp-skelton";

// ----------------------------------------------------------------------

type Props = {
  id: string;
};

export default function CustomLpDetailView({ id }: Props) {
  const { customLp, customLpLoading, customLpError } = useGetCustomLp(id);

  const settings = useSettingsContext();

  const renderSkeleton = <CustomLpDetailSkeleton />;

  const renderError = (
    <EmptyContent
      filled
      title={`${customLpError?.message}`}
      action={
        <Button
          component={RouterLink}
          href={paths.admin.trainCompany.root}
          startIcon={<Iconify icon="eva:arrow-ios-back-fill" width={16} />}
          sx={{ mt: 3 }}
        >
          一覧へ戻る
        </Button>
      }
      sx={{ py: 10 }}
    />
  );

  const renderCustomLp = customLp && (
    <>
      <CustomBreadcrumbs
        heading="専用LP設定詳細"
        links={[
          { name: "ダッシュボード", href: paths.admin.dashboard },
          {
            name: "専用LP設定",
            href: paths.admin.customLp.root,
          },
          { name: customLp?.title },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <CustomLpDetailToolbar
        backLink={paths.admin.customLp.root}
        editLink={paths.admin.customLp.edit(`${customLp?.id}`)}
      />

      <Card>
        <Stack spacing={3} sx={{ p: 3 }}>
          <Stack direction="row">
            <Typography variant="subtitle2" sx={{ width: 160 }}>
              タイトル
            </Typography>
            <Typography variant="body2" sx={{ flexGrow: 1 }}>
              {customLp.title}
            </Typography>
          </Stack>

          <Stack direction="row">
            <Typography variant="subtitle2" sx={{ width: 160 }}>
              パーマリンク
            </Typography>
            <Typography variant="body2" sx={{ flexGrow: 1 }}>
              {customLp.permalink}
            </Typography>
          </Stack>

          <Stack direction="row">
            <Typography variant="subtitle2" sx={{ width: 160 }}>
              ポイント1
            </Typography>
            <Typography variant="body2" sx={{ flexGrow: 1 }}>
              {customLp.point1}
            </Typography>
          </Stack>

          <Stack direction="row">
            <Typography variant="subtitle2" sx={{ width: 160 }}>
              ポイント2
            </Typography>
            <Typography variant="body2" sx={{ flexGrow: 1 }}>
              {customLp.point2}
            </Typography>
          </Stack>

          <Stack direction="row">
            <Typography variant="subtitle2" sx={{ width: 160 }}>
              ポイント3
            </Typography>
            <Typography variant="body2" sx={{ flexGrow: 1 }}>
              {customLp.point3}
            </Typography>
          </Stack>

          <Stack direction="row">
            <Typography variant="subtitle2" sx={{ width: 160 }}>
              状態
            </Typography>
            <Label
              variant="soft"
              color={
                (customLp.status == "0" && "default") ||
                (customLp.status == "1" && "info") ||
                "warning"
              }
            >
              {customLp.status_name}
            </Label>
          </Stack>

          <Stack direction="row">
            <Typography variant="subtitle2" sx={{ width: 160 }}>
              ロゴ
            </Typography>
            <Typography variant="body2" sx={{ flexGrow: 1 }}>
              {customLp.logo}
            </Typography>
          </Stack>
        </Stack>
      </Card>
    </>
  );

  return (
    <Container maxWidth={settings.themeStretch ? false : "lg"}>
      {customLpLoading && renderSkeleton}

      {customLpError && renderError}

      {customLp && renderCustomLp}
    </Container>
  );
}
