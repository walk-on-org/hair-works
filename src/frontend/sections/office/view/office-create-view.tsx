"use client";

import Container from "@mui/material/Container";

import { paths } from "@/routes/paths";

import { useGetCorporations } from "@/api/corporation";
import { useGetPrefectures } from "@/api/prefecture";
import { useGetCities } from "@/api/city";
import { useGetStations } from "@/api/station";

import { useSettingsContext } from "@/components/settings";
import CustomBreadcrumbs from "@/components/custom-breadcrumbs";

import OfficeNewEditForm from "../office-new-edit-form";

// ----------------------------------------------------------------------

export default function OfficeCreateView() {
  const settings = useSettingsContext();

  const { prefectures } = useGetPrefectures();
  const { cities } = useGetCities();
  const { corporations } = useGetCorporations();
  const { stations } = useGetStations();

  return (
    <Container maxWidth={settings.themeStretch ? false : "lg"}>
      <CustomBreadcrumbs
        heading="法人作成"
        links={[
          { name: "ダッシュボード", href: paths.admin.dashboard },
          {
            name: "事業所",
            href: paths.admin.office.root,
          },
          { name: "事業所を作成" },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <OfficeNewEditForm
        corporations={corporations}
        prefectures={prefectures}
        cities={cities}
        stations={stations}
      />
    </Container>
  );
}
