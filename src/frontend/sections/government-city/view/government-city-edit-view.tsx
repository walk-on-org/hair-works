"use client";

import Container from "@mui/material/Container";

import { paths } from "@/routes/paths";

import { useGetGovernmentCity } from "@/api/government-city";
import { useGetPrefectures } from "@/api/prefecture";

import { useSettingsContext } from "@/components/settings";
import CustomBreadcrumbs from "@/components/custom-breadcrumbs";

import GovernmentCityNewEditForm from "../government-city-new-edit-form";

// ----------------------------------------------------------------------

type Props = {
  id: string;
};

export default function GovernmentCityEditView({ id }: Props) {
  const settings = useSettingsContext();

  const { governmentCity: currentGovernmentCity } = useGetGovernmentCity(id);

  const { prefectures } = useGetPrefectures();

  return (
    <Container maxWidth={settings.themeStretch ? false : "lg"}>
      <CustomBreadcrumbs
        heading="政令指定都市マスタ編集"
        links={[
          { name: "ダッシュボード", href: paths.admin.dashboard },
          {
            name: "政令指定都市マスタ",
            href: paths.admin.governmentCity.root,
          },
          { name: currentGovernmentCity?.name },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <GovernmentCityNewEditForm
        currentGovernmentCity={currentGovernmentCity}
        prefectures={prefectures}
      />
    </Container>
  );
}
