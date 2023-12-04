"use client";

import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";

import { paths } from "@/routes/paths";
import { RouterLink } from "@/routes/components";

import { useGetLine } from "@/api/line";

import Label from "@/components/label";
import CustomBreadcrumbs from "@/components/custom-breadcrumbs";
import Iconify from "@/components/iconify";
import EmptyContent from "@/components/empty-content";
import { useSettingsContext } from "@/components/settings";

import LineDetailToolbar from "../line-detail-toolbar";
import { LineDetailSkeleton } from "../line-skelton";

// ----------------------------------------------------------------------

type Props = {
  id: string;
};

export default function LineDetailView({ id }: Props) {
  const { line, lineLoading, lineError } = useGetLine(id);

  const settings = useSettingsContext();

  const renderSkeleton = <LineDetailSkeleton />;

  const renderError = (
    <EmptyContent
      filled
      title={`${lineError?.message}`}
      action={
        <Button
          component={RouterLink}
          href={paths.admin.line.root}
          startIcon={<Iconify icon="eva:arrow-ios-back-fill" width={16} />}
          sx={{ mt: 3 }}
        >
          一覧へ戻る
        </Button>
      }
      sx={{ py: 10 }}
    />
  );

  const renderLine = line && (
    <>
      <CustomBreadcrumbs
        heading="路線マスタ詳細"
        links={[
          { name: "ダッシュボード", href: paths.admin.dashboard },
          {
            name: "路線マスタ",
            href: paths.admin.line.root,
          },
          { name: line?.name },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <LineDetailToolbar
        backLink={paths.admin.line.root}
        editLink={paths.admin.line.edit(`${line?.id}`)}
      />

      <Card>
        <Stack spacing={3} sx={{ p: 3 }}>
          <Stack direction="row">
            <Typography variant="subtitle2" sx={{ width: 160 }}>
              路線名
            </Typography>
            <Typography variant="body2" sx={{ flexGrow: 1 }}>
              {line.name}
            </Typography>
          </Stack>

          <Stack direction="row">
            <Typography variant="subtitle2" sx={{ width: 160 }}>
              パーマリンク
            </Typography>
            <Typography variant="body2" sx={{ flexGrow: 1 }}>
              {line.permalink}
            </Typography>
          </Stack>

          <Stack direction="row">
            <Typography variant="subtitle2" sx={{ width: 160 }}>
              鉄道事業者
            </Typography>
            <Typography variant="body2" sx={{ flexGrow: 1 }}>
              {line.train_company_name}
            </Typography>
          </Stack>

          <Stack direction="row">
            <Typography variant="subtitle2" sx={{ width: 160 }}>
              状態
            </Typography>
            <Label
              variant="soft"
              color={
                (line.status == "1" && "info") ||
                (line.status == "1" && "default") ||
                "warning"
              }
            >
              {line.status_name}
            </Label>
          </Stack>

          <Stack direction="row">
            <Typography variant="subtitle2" sx={{ width: 160 }}>
              ソート順
            </Typography>
            <Typography variant="body2" sx={{ flexGrow: 1 }}>
              {line.sort}
            </Typography>
          </Stack>
        </Stack>
      </Card>
    </>
  );

  return (
    <Container maxWidth={settings.themeStretch ? false : "lg"}>
      {lineLoading && renderSkeleton}

      {lineError && renderError}

      {line && renderLine}
    </Container>
  );
}
