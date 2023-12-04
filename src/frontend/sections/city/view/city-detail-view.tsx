"use client";

import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";

import { paths } from "@/routes/paths";
import { RouterLink } from "@/routes/components";

import { useGetCity } from "@/api/city";

import CustomBreadcrumbs from "@/components/custom-breadcrumbs";
import Iconify from "@/components/iconify";
import EmptyContent from "@/components/empty-content";
import { useSettingsContext } from "@/components/settings";

import CityDetailToolbar from "../city-detail-toolbar";
import { CityDetailSkeleton } from "../city-skelton";

// ----------------------------------------------------------------------

type Props = {
  id: string;
};

export default function CityDetailView({ id }: Props) {
  const { city, cityLoading, cityError } = useGetCity(id);

  const settings = useSettingsContext();

  const renderSkeleton = <CityDetailSkeleton />;

  const renderError = (
    <EmptyContent
      filled
      title={`${cityError?.message}`}
      action={
        <Button
          component={RouterLink}
          href={paths.admin.city.root}
          startIcon={<Iconify icon="eva:arrow-ios-back-fill" width={16} />}
          sx={{ mt: 3 }}
        >
          一覧へ戻る
        </Button>
      }
      sx={{ py: 10 }}
    />
  );

  const renderCity = city && (
    <>
      <CustomBreadcrumbs
        heading="市区町村マスタ詳細"
        links={[
          { name: "ダッシュボード", href: paths.admin.dashboard },
          {
            name: "市区町村マスタ",
            href: paths.admin.city.root,
          },
          { name: city?.name },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <CityDetailToolbar
        backLink={paths.admin.city.root}
        editLink={paths.admin.city.edit(`${city?.id}`)}
      />

      <Card>
        <Stack spacing={3} sx={{ p: 3 }}>
          <Stack direction="row">
            <Typography variant="subtitle2" sx={{ width: 160 }}>
              市区町村名
            </Typography>
            <Typography variant="body2" sx={{ flexGrow: 1 }}>
              {city.name}
            </Typography>
          </Stack>

          <Stack direction="row">
            <Typography variant="subtitle2" sx={{ width: 160 }}>
              パーマリンク
            </Typography>
            <Typography variant="body2" sx={{ flexGrow: 1 }}>
              {city.permalink}
            </Typography>
          </Stack>

          <Stack direction="row">
            <Typography variant="subtitle2" sx={{ width: 160 }}>
              都道府県
            </Typography>
            <Typography variant="body2" sx={{ flexGrow: 1 }}>
              {city.prefecture_name}
            </Typography>
          </Stack>

          <Stack direction="row">
            <Typography variant="subtitle2" sx={{ width: 160 }}>
              政令指定都市
            </Typography>
            <Typography variant="body2" sx={{ flexGrow: 1 }}>
              {city.government_city_name}
            </Typography>
          </Stack>
        </Stack>
      </Card>
    </>
  );

  return (
    <Container maxWidth={settings.themeStretch ? false : "lg"}>
      {cityLoading && renderSkeleton}

      {cityError && renderError}

      {city && renderCity}
    </Container>
  );
}
