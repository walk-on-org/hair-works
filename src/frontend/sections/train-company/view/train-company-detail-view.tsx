"use client";

import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";

import { paths } from "@/routes/paths";
import { RouterLink } from "@/routes/components";

import { useGetTrainCompany } from "@/api/train-company";

import Label from "@/components/label";
import CustomBreadcrumbs from "@/components/custom-breadcrumbs";
import Iconify from "@/components/iconify";
import EmptyContent from "@/components/empty-content";
import { useSettingsContext } from "@/components/settings";

import TrainCompanyDetailToolbar from "../train-company-detail-toolbar";
import { TrainCompanyDetailSkeleton } from "../train-company-skelton";

// ----------------------------------------------------------------------

type Props = {
  id: string;
};

export default function TrainCompanyDetailView({ id }: Props) {
  const { trainCompany, trainCompanyLoading, trainCompanyError } =
    useGetTrainCompany(id);

  const settings = useSettingsContext();

  const renderSkeleton = <TrainCompanyDetailSkeleton />;

  const renderError = (
    <EmptyContent
      filled
      title={`${trainCompanyError?.message}`}
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

  const renderTrainCompany = trainCompany && (
    <>
      <CustomBreadcrumbs
        heading="鉄道事業者マスタ詳細"
        links={[
          { name: "ダッシュボード", href: paths.admin.dashboard },
          {
            name: "鉄道事業者マスタ",
            href: paths.admin.trainCompany.root,
          },
          { name: trainCompany?.name },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <TrainCompanyDetailToolbar
        backLink={paths.admin.trainCompany.root}
        editLink={paths.admin.trainCompany.edit(`${trainCompany?.id}`)}
      />

      <Card>
        <Stack spacing={3} sx={{ p: 3 }}>
          <Stack direction="row">
            <Typography variant="subtitle2" sx={{ width: 160 }}>
              鉄道事業者名
            </Typography>
            <Typography variant="body2" sx={{ flexGrow: 1 }}>
              {trainCompany.name}
            </Typography>
          </Stack>

          <Stack direction="row">
            <Typography variant="subtitle2" sx={{ width: 160 }}>
              鉄道事業者名（略称）
            </Typography>
            <Typography variant="body2" sx={{ flexGrow: 1 }}>
              {trainCompany.name_r}
            </Typography>
          </Stack>

          <Stack direction="row">
            <Typography variant="subtitle2" sx={{ width: 160 }}>
              状態
            </Typography>
            <Label
              variant="soft"
              color={
                (trainCompany.status == "1" && "info") ||
                (trainCompany.status == "1" && "default") ||
                "warning"
              }
            >
              {trainCompany.status_name}
            </Label>
          </Stack>

          <Stack direction="row">
            <Typography variant="subtitle2" sx={{ width: 160 }}>
              ソート順
            </Typography>
            <Typography variant="body2" sx={{ flexGrow: 1 }}>
              {trainCompany.sort}
            </Typography>
          </Stack>
        </Stack>
      </Card>
    </>
  );

  return (
    <Container maxWidth={settings.themeStretch ? false : "lg"}>
      {trainCompanyLoading && renderSkeleton}

      {trainCompanyError && renderError}

      {trainCompany && renderTrainCompany}
    </Container>
  );
}
