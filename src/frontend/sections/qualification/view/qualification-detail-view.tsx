"use client";

import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";

import { paths } from "@/routes/paths";
import { RouterLink } from "@/routes/components";

import { useGetQualification } from "@/api/qualification";

import Label from "@/components/label";
import CustomBreadcrumbs from "@/components/custom-breadcrumbs";
import Iconify from "@/components/iconify";
import EmptyContent from "@/components/empty-content";
import { useSettingsContext } from "@/components/settings";

import QualificationDetailToolbar from "../qualification-detail-toolbar";
import { QualificationDetailSkeleton } from "../qualification-skelton";

// ----------------------------------------------------------------------

type Props = {
  id: string;
};

export default function QualificationDetailView({ id }: Props) {
  const { qualification, qualificationLoading, qualificationError } =
    useGetQualification(id);

  const settings = useSettingsContext();

  const renderSkeleton = <QualificationDetailSkeleton />;

  const renderError = (
    <EmptyContent
      filled
      title={`${qualificationError?.message}`}
      action={
        <Button
          component={RouterLink}
          href={paths.admin.qualification.root}
          startIcon={<Iconify icon="eva:arrow-ios-back-fill" width={16} />}
          sx={{ mt: 3 }}
        >
          一覧へ戻る
        </Button>
      }
      sx={{ py: 10 }}
    />
  );

  const renderQualification = qualification && (
    <>
      <CustomBreadcrumbs
        heading="保有資格マスタ詳細"
        links={[
          { name: "ダッシュボード", href: paths.admin.dashboard },
          {
            name: "保有資格マスタ",
            href: paths.admin.qualification.root,
          },
          { name: qualification?.name },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <QualificationDetailToolbar
        backLink={paths.admin.qualification.root}
        editLink={paths.admin.qualification.edit(`${qualification?.id}`)}
      />

      <Card>
        <Stack spacing={3} sx={{ p: 3 }}>
          <Stack direction="row">
            <Typography variant="subtitle2" sx={{ width: 160 }}>
              保有資格名
            </Typography>
            <Typography variant="body2" sx={{ flexGrow: 1 }}>
              {qualification.name}
            </Typography>
          </Stack>

          <Stack direction="row">
            <Typography variant="subtitle2" sx={{ width: 160 }}>
              状態
            </Typography>
            <Label
              variant="soft"
              color={(qualification.status == "1" && "info") || "default"}
            >
              {qualification.status_name}
            </Label>
          </Stack>

          <Stack direction="row">
            <Typography variant="subtitle2" sx={{ width: 160 }}>
              ソート順
            </Typography>
            <Typography variant="body2" sx={{ flexGrow: 1 }}>
              {qualification.sort}
            </Typography>
          </Stack>
        </Stack>
      </Card>
    </>
  );

  return (
    <Container maxWidth={settings.themeStretch ? false : "lg"}>
      {qualificationLoading && renderSkeleton}

      {qualificationError && renderError}

      {qualification && renderQualification}
    </Container>
  );
}
