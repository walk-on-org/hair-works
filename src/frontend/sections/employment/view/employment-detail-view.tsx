"use client";

import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";

import { paths } from "@/routes/paths";
import { RouterLink } from "@/routes/components";

import { useGetEmployment } from "@/api/employment";

import Label from "@/components/label";
import CustomBreadcrumbs from "@/components/custom-breadcrumbs";
import Iconify from "@/components/iconify";
import EmptyContent from "@/components/empty-content";
import { useSettingsContext } from "@/components/settings";

import EmploymentDetailToolbar from "../employment-detail-toolbar";
import { EmploymentDetailSkeleton } from "../employment-skelton";

// ----------------------------------------------------------------------

type Props = {
  id: string;
};

export default function EmploymentDetailView({ id }: Props) {
  const { employment, employmentLoading, employmentError } =
    useGetEmployment(id);

  const settings = useSettingsContext();

  const renderSkeleton = <EmploymentDetailSkeleton />;

  const renderError = (
    <EmptyContent
      filled
      title={`${employmentError?.message}`}
      action={
        <Button
          component={RouterLink}
          href={paths.admin.employment.root}
          startIcon={<Iconify icon="eva:arrow-ios-back-fill" width={16} />}
          sx={{ mt: 3 }}
        >
          一覧へ戻る
        </Button>
      }
      sx={{ py: 10 }}
    />
  );

  const renderEmployment = employment && (
    <>
      <CustomBreadcrumbs
        heading="雇用形態マスタ詳細"
        links={[
          { name: "ダッシュボード", href: paths.admin.dashboard },
          {
            name: "雇用形態マスタ",
            href: paths.admin.employment.root,
          },
          { name: employment?.name },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <EmploymentDetailToolbar
        backLink={paths.admin.employment.root}
        editLink={paths.admin.employment.edit(`${employment?.id}`)}
      />

      <Card>
        <Stack spacing={3} sx={{ p: 3 }}>
          <Stack direction="row">
            <Typography variant="subtitle2" sx={{ width: 160 }}>
              雇用形態名
            </Typography>
            <Typography variant="body2" sx={{ flexGrow: 1 }}>
              {employment.name}
            </Typography>
          </Stack>

          <Stack direction="row">
            <Typography variant="subtitle2" sx={{ width: 160 }}>
              パーマリンク
            </Typography>
            <Typography variant="body2" sx={{ flexGrow: 1 }}>
              {employment.permalink}
            </Typography>
          </Stack>

          <Stack direction="row">
            <Typography variant="subtitle2" sx={{ width: 160 }}>
              状態
            </Typography>
            <Label
              variant="soft"
              color={(employment.status == "1" && "info") || "default"}
            >
              {employment.status_name}
            </Label>
          </Stack>
        </Stack>
      </Card>
    </>
  );

  return (
    <Container maxWidth={settings.themeStretch ? false : "lg"}>
      {employmentLoading && renderSkeleton}

      {employmentError && renderError}

      {employment && renderEmployment}
    </Container>
  );
}
