"use client";

import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";

import { paths } from "@/routes/paths";
import { RouterLink } from "@/routes/components";

import { useGetStation } from "@/api/station";

import Label from "@/components/label";
import CustomBreadcrumbs from "@/components/custom-breadcrumbs";
import Iconify from "@/components/iconify";
import EmptyContent from "@/components/empty-content";
import { useSettingsContext } from "@/components/settings";

import StationDetailToolbar from "../station-detail-toolbar";
import { StationDetailSkeleton } from "../station-skelton";

// ----------------------------------------------------------------------

type Props = {
  id: string;
};

export default function StationDetailView({ id }: Props) {
  const { station, stationLoading, stationError } = useGetStation(id);

  const settings = useSettingsContext();

  const renderSkeleton = <StationDetailSkeleton />;

  const renderError = (
    <EmptyContent
      filled
      title={`${stationError?.message}`}
      action={
        <Button
          component={RouterLink}
          href={paths.admin.station.root}
          startIcon={<Iconify icon="eva:arrow-ios-back-fill" width={16} />}
          sx={{ mt: 3 }}
        >
          一覧へ戻る
        </Button>
      }
      sx={{ py: 10 }}
    />
  );

  const renderStation = station && (
    <>
      <CustomBreadcrumbs
        heading="駅マスタ詳細"
        links={[
          { name: "ダッシュボード", href: paths.admin.dashboard },
          {
            name: "駅マスタ",
            href: paths.admin.station.root,
          },
          { name: station?.name },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <StationDetailToolbar
        backLink={paths.admin.station.root}
        editLink={paths.admin.station.edit(`${station?.id}`)}
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
              駅ID
            </Typography>
            <Typography variant="body2" sx={{ flexGrow: 1 }}>
              {station.id}
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
              駅名
            </Typography>
            <Typography variant="body2" sx={{ flexGrow: 1 }}>
              {station.name}
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
              パーマリンク
            </Typography>
            <Typography variant="body2" sx={{ flexGrow: 1 }}>
              {station.permalink}
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
              駅グループID
            </Typography>
            <Typography variant="body2" sx={{ flexGrow: 1 }}>
              {station.station_group_id}
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
              路線
            </Typography>
            <Typography variant="body2" sx={{ flexGrow: 1 }}>
              {station.line_name}
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
              都道府県
            </Typography>
            <Typography variant="body2" sx={{ flexGrow: 1 }}>
              {station.prefecture_name}
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
              市区町村
            </Typography>
            <Typography variant="body2" sx={{ flexGrow: 1 }}>
              {station.city_name}
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
              color={
                (station.status == "0" && "info") ||
                (station.status == "1" && "default") ||
                "warning"
              }
              width="fit-content"
            >
              {station.status_name}
            </Label>
          </Stack>

          <Stack
            direction={{
              xs: "column",
              md: "row",
            }}
            rowGap={1}
          >
            <Typography variant="subtitle2" sx={{ width: 160 }}>
              ソート順
            </Typography>
            <Typography variant="body2" sx={{ flexGrow: 1 }}>
              {station.sort}
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
              緯度
            </Typography>
            <Typography variant="body2" sx={{ flexGrow: 1 }}>
              {station.lat}
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
              経度
            </Typography>
            <Typography variant="body2" sx={{ flexGrow: 1 }}>
              {station.lng}
            </Typography>
          </Stack>
        </Stack>
      </Card>
    </>
  );

  return (
    <Container maxWidth={settings.themeStretch ? false : "lg"}>
      {stationLoading && renderSkeleton}

      {stationError && renderError}

      {station && renderStation}
    </Container>
  );
}
