"use client";

import Container from "@mui/material/Container";

import { paths } from "@/routes/paths";

import { useGetStation } from "@/api/station";
import { useGetLines } from "@/api/line";
import { useGetPrefectures } from "@/api/prefecture";
import { useGetCities } from "@/api/city";

import { useSettingsContext } from "@/components/settings";
import CustomBreadcrumbs from "@/components/custom-breadcrumbs";

import StationNewEditForm from "../station-new-edit-form";

// ----------------------------------------------------------------------

type Props = {
  id: string;
};

export default function StationEditView({ id }: Props) {
  const settings = useSettingsContext();

  const { station: currentStation } = useGetStation(id);
  const { lines } = useGetLines();
  const { prefectures } = useGetPrefectures();
  const { cities } = useGetCities();

  return (
    <Container maxWidth={settings.themeStretch ? false : "lg"}>
      <CustomBreadcrumbs
        heading="駅マスタ編集"
        links={[
          { name: "ダッシュボード", href: paths.admin.dashboard },
          {
            name: "駅マスタ",
            href: paths.admin.station.root,
          },
          { name: currentStation?.name },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <StationNewEditForm
        currentStation={currentStation}
        lines={lines}
        prefectures={prefectures}
        cities={cities}
      />
    </Container>
  );
}
