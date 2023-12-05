"use client";

import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";

import { paths } from "@/routes/paths";
import { RouterLink } from "@/routes/components";

import { useGetHoliday } from "@/api/holiday";

import Label from "@/components/label";
import CustomBreadcrumbs from "@/components/custom-breadcrumbs";
import Iconify from "@/components/iconify";
import EmptyContent from "@/components/empty-content";
import { useSettingsContext } from "@/components/settings";

import HolidayDetailToolbar from "../holiday-detail-toolbar";
import { HolidayDetailSkeleton } from "../holiday-skelton";

// ----------------------------------------------------------------------

type Props = {
  id: string;
};

export default function HolidayDetailView({ id }: Props) {
  const { holiday, holidayLoading, holidayError } = useGetHoliday(id);

  const settings = useSettingsContext();

  const renderSkeleton = <HolidayDetailSkeleton />;

  const renderError = (
    <EmptyContent
      filled
      title={`${holidayError?.message}`}
      action={
        <Button
          component={RouterLink}
          href={paths.admin.holiday.root}
          startIcon={<Iconify icon="eva:arrow-ios-back-fill" width={16} />}
          sx={{ mt: 3 }}
        >
          一覧へ戻る
        </Button>
      }
      sx={{ py: 10 }}
    />
  );

  const renderHoliday = holiday && (
    <>
      <CustomBreadcrumbs
        heading="休日マスタ詳細"
        links={[
          { name: "ダッシュボード", href: paths.admin.dashboard },
          {
            name: "休日マスタ",
            href: paths.admin.holiday.root,
          },
          { name: holiday?.name },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <HolidayDetailToolbar
        backLink={paths.admin.holiday.root}
        editLink={paths.admin.holiday.edit(`${holiday?.id}`)}
      />

      <Card>
        <Stack spacing={3} sx={{ p: 3 }}>
          <Stack direction="row">
            <Typography variant="subtitle2" sx={{ width: 160 }}>
              休日名
            </Typography>
            <Typography variant="body2" sx={{ flexGrow: 1 }}>
              {holiday.name}
            </Typography>
          </Stack>

          <Stack direction="row">
            <Typography variant="subtitle2" sx={{ width: 160 }}>
              パーマリンク
            </Typography>
            <Typography variant="body2" sx={{ flexGrow: 1 }}>
              {holiday.permalink}
            </Typography>
          </Stack>

          <Stack direction="row">
            <Typography variant="subtitle2" sx={{ width: 160 }}>
              状態
            </Typography>
            <Label
              variant="soft"
              color={(holiday.status == "1" && "info") || "default"}
            >
              {holiday.status_name}
            </Label>
          </Stack>
        </Stack>
      </Card>
    </>
  );

  return (
    <Container maxWidth={settings.themeStretch ? false : "lg"}>
      {holidayLoading && renderSkeleton}

      {holidayError && renderError}

      {holiday && renderHoliday}
    </Container>
  );
}
