"use client";

import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";

import { paths } from "@/routes/paths";
import { RouterLink } from "@/routes/components";

import { useGetGovernmentCity } from "@/api/government-city";

import CustomBreadcrumbs from "@/components/custom-breadcrumbs";
import Iconify from "@/components/iconify";
import EmptyContent from "@/components/empty-content";
import { useSettingsContext } from "@/components/settings";

import GovernmentCityDetailToolbar from "../government-city-detail-toolbar";
import { GovernmentCityDetailSkeleton } from "../government-city-skelton";

// ----------------------------------------------------------------------

type Props = {
  id: string;
};

export default function GovernmentCityDetailView({ id }: Props) {
  const { governmentCity, governmentCityLoading, governmentCityError } =
    useGetGovernmentCity(id);

  const settings = useSettingsContext();

  const renderSkeleton = <GovernmentCityDetailSkeleton />;

  const renderError = (
    <EmptyContent
      filled
      title={`${governmentCityError?.message}`}
      action={
        <Button
          component={RouterLink}
          href={paths.admin.governmentCity.root}
          startIcon={<Iconify icon="eva:arrow-ios-back-fill" width={16} />}
          sx={{ mt: 3 }}
        >
          一覧へ戻る
        </Button>
      }
      sx={{ py: 10 }}
    />
  );

  const renderGovernmentCity = governmentCity && (
    <>
      <CustomBreadcrumbs
        heading="政令指定都市マスタ詳細"
        links={[
          { name: "ダッシュボード", href: paths.admin.dashboard },
          {
            name: "政令指定都市マスタ",
            href: paths.admin.governmentCity.root,
          },
          { name: governmentCity?.name },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <GovernmentCityDetailToolbar
        backLink={paths.admin.governmentCity.root}
        editLink={paths.admin.governmentCity.edit(`${governmentCity?.id}`)}
      />

      <Card>
        <Stack spacing={3} sx={{ p: 3 }}>
          <Stack direction="row">
            <Typography variant="subtitle2" sx={{ width: 160 }}>
              政令指定都市名
            </Typography>
            <Typography variant="body2" sx={{ flexGrow: 1 }}>
              {governmentCity.name}
            </Typography>
          </Stack>

          <Stack direction="row">
            <Typography variant="subtitle2" sx={{ width: 160 }}>
              パーマリンク
            </Typography>
            <Typography variant="body2" sx={{ flexGrow: 1 }}>
              {governmentCity.permalink}
            </Typography>
          </Stack>

          <Stack direction="row">
            <Typography variant="subtitle2" sx={{ width: 160 }}>
              都道府県
            </Typography>
            <Typography variant="body2" sx={{ flexGrow: 1 }}>
              {governmentCity.prefecture_name}
            </Typography>
          </Stack>
        </Stack>
      </Card>
    </>
  );

  return (
    <Container maxWidth={settings.themeStretch ? false : "lg"}>
      {governmentCityLoading && renderSkeleton}

      {governmentCityError && renderError}

      {governmentCity && renderGovernmentCity}
    </Container>
  );
}
