"use client";

import { format } from "date-fns";

import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";

import { paths } from "@/routes/paths";
import { RouterLink } from "@/routes/components";

import { useGetNationalHoliday } from "@/api/national-holiday";

import CustomBreadcrumbs from "@/components/custom-breadcrumbs";
import Iconify from "@/components/iconify";
import EmptyContent from "@/components/empty-content";
import { useSettingsContext } from "@/components/settings";

import NationalHolidayDetailToolbar from "../national-holiday-detail-toolbar";
import { NationalHolidayDetailSkeleton } from "../national-holiday-skelton";

// ----------------------------------------------------------------------

type Props = {
  id: string;
};

export default function NationalHolidayDetailView({ id }: Props) {
  const { nationalHoliday, nationalHolidayLoading, nationalHolidayError } =
    useGetNationalHoliday(id);

  const settings = useSettingsContext();

  const renderSkeleton = <NationalHolidayDetailSkeleton />;

  const renderError = (
    <EmptyContent
      filled
      title={`${nationalHolidayError?.message}`}
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

  const renderNationalHoliday = nationalHoliday && (
    <>
      <CustomBreadcrumbs
        heading="祝日マスタ詳細"
        links={[
          { name: "ダッシュボード", href: paths.admin.dashboard },
          {
            name: "祝日マスタ",
            href: paths.admin.nationalHoliday.root,
          },
          { name: nationalHoliday?.name },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <NationalHolidayDetailToolbar
        backLink={paths.admin.nationalHoliday.root}
        editLink={paths.admin.nationalHoliday.edit(`${nationalHoliday?.id}`)}
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
              祝日名
            </Typography>
            <Typography variant="body2" sx={{ flexGrow: 1 }}>
              {nationalHoliday.name}
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
              日付
            </Typography>
            <Typography variant="body2" sx={{ flexGrow: 1 }}>
              {format(new Date(nationalHoliday.date), "yyyy年MM月dd日")}
            </Typography>
          </Stack>
        </Stack>
      </Card>
    </>
  );

  return (
    <Container maxWidth={settings.themeStretch ? false : "lg"}>
      {nationalHolidayLoading && renderSkeleton}

      {nationalHolidayError && renderError}

      {nationalHoliday && renderNationalHoliday}
    </Container>
  );
}
