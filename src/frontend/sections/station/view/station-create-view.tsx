"use client";

import Container from "@mui/material/Container";

import { paths } from "@/routes/paths";

import { useSettingsContext } from "@/components/settings";
import CustomBreadcrumbs from "@/components/custom-breadcrumbs";

import StationNewEditForm from "../station-new-edit-form";
import { useGetLines } from "@/api/line";
import { useGetPrefectures } from "@/api/prefecture";
import { useGetCities } from "@/api/city";

// ----------------------------------------------------------------------

export default function StationCreateView() {
  const settings = useSettingsContext();

  const { lines } = useGetLines();
  const { prefectures } = useGetPrefectures();
  const { cities } = useGetCities();

  return (
    <Container maxWidth={settings.themeStretch ? false : "lg"}>
      <CustomBreadcrumbs
        heading="駅マスタ作成"
        links={[
          { name: "ダッシュボード", href: paths.admin.dashboard },
          {
            name: "駅マスタ",
            href: paths.admin.station.root,
          },
          { name: "駅を作成" },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <StationNewEditForm
        lines={lines}
        prefectures={prefectures}
        cities={cities}
      />
    </Container>
  );
}
