"use client";

import Container from "@mui/material/Container";

import { paths } from "@/routes/paths";

import { useSettingsContext } from "@/components/settings";
import CustomBreadcrumbs from "@/components/custom-breadcrumbs";

import { useGetPrefectures } from "@/api/prefecture";

import CityNewEditForm from "../city-new-edit-form";
import { useGetGovernmentCities } from "@/api/government-city";

// ----------------------------------------------------------------------

export default function CityCreateView() {
  const settings = useSettingsContext();

  const { prefectures } = useGetPrefectures();
  const { governmentCities } = useGetGovernmentCities();

  return (
    <Container maxWidth={settings.themeStretch ? false : "lg"}>
      <CustomBreadcrumbs
        heading="市区町村マスタ作成"
        links={[
          { name: "ダッシュボード", href: paths.admin.dashboard },
          {
            name: "市区町村マスタ",
            href: paths.admin.city.root,
          },
          { name: "市区町村を作成" },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <CityNewEditForm
        prefectures={prefectures}
        governmentCities={governmentCities}
      />
    </Container>
  );
}
