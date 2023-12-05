"use client";

import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";

import { paths } from "@/routes/paths";
import { RouterLink } from "@/routes/components";

import { useGetPosition } from "@/api/position";

import Label from "@/components/label";
import CustomBreadcrumbs from "@/components/custom-breadcrumbs";
import Iconify from "@/components/iconify";
import EmptyContent from "@/components/empty-content";
import { useSettingsContext } from "@/components/settings";

import PositionDetailToolbar from "../position-detail-toolbar";
import { PositionDetailSkeleton } from "../position-skelton";

// ----------------------------------------------------------------------

type Props = {
  id: string;
};

export default function PositionDetailView({ id }: Props) {
  const { position, positionLoading, positionError } = useGetPosition(id);

  const settings = useSettingsContext();

  const renderSkeleton = <PositionDetailSkeleton />;

  const renderError = (
    <EmptyContent
      filled
      title={`${positionError?.message}`}
      action={
        <Button
          component={RouterLink}
          href={paths.admin.position.root}
          startIcon={<Iconify icon="eva:arrow-ios-back-fill" width={16} />}
          sx={{ mt: 3 }}
        >
          一覧へ戻る
        </Button>
      }
      sx={{ py: 10 }}
    />
  );

  const renderPosition = position && (
    <>
      <CustomBreadcrumbs
        heading="役職/役割マスタ詳細"
        links={[
          { name: "ダッシュボード", href: paths.admin.dashboard },
          {
            name: "役職/役割マスタ",
            href: paths.admin.position.root,
          },
          { name: position?.name },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <PositionDetailToolbar
        backLink={paths.admin.position.root}
        editLink={paths.admin.position.edit(`${position?.id}`)}
      />

      <Card>
        <Stack spacing={3} sx={{ p: 3 }}>
          <Stack direction="row">
            <Typography variant="subtitle2" sx={{ width: 160 }}>
              役職/役割名
            </Typography>
            <Typography variant="body2" sx={{ flexGrow: 1 }}>
              {position.name}
            </Typography>
          </Stack>

          <Stack direction="row">
            <Typography variant="subtitle2" sx={{ width: 160 }}>
              パーマリンク
            </Typography>
            <Typography variant="body2" sx={{ flexGrow: 1 }}>
              {position.permalink}
            </Typography>
          </Stack>

          <Stack direction="row">
            <Typography variant="subtitle2" sx={{ width: 160 }}>
              状態
            </Typography>
            <Label
              variant="soft"
              color={(position.status == "1" && "info") || "default"}
            >
              {position.status_name}
            </Label>
          </Stack>
        </Stack>
      </Card>
    </>
  );

  return (
    <Container maxWidth={settings.themeStretch ? false : "lg"}>
      {positionLoading && renderSkeleton}

      {positionError && renderError}

      {position && renderPosition}
    </Container>
  );
}
