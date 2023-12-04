"use client";

import Container from "@mui/material/Container";

import { paths } from "@/routes/paths";

import { useGetCity } from "@/api/city";
import { useGetGovernmentCities } from "@/api/government-city";
import { useGetPrefectures } from "@/api/prefecture";

import { useSettingsContext } from "@/components/settings";
import CustomBreadcrumbs from "@/components/custom-breadcrumbs";

import CityNewEditForm from "../city-new-edit-form";

// ----------------------------------------------------------------------

type Props = {
  id: string;
};

export default function CityEditView({ id }: Props) {
  const settings = useSettingsContext();

  const { city: currentCity } = useGetCity(id);
  const { governmentCities } = useGetGovernmentCities();
  const { prefectures } = useGetPrefectures();

  return (
    <Container maxWidth={settings.themeStretch ? false : "lg"}>
      <CustomBreadcrumbs
        heading="市区町村マスタ編集"
        links={[
          { name: "ダッシュボード", href: paths.admin.dashboard },
          {
            name: "市区町村マスタ",
            href: paths.admin.city.root,
          },
          { name: currentCity?.name },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <CityNewEditForm
        currentCity={currentCity}
        prefectures={prefectures}
        governmentCities={governmentCities}
      />
    </Container>
  );
}
