"use client";

import Container from "@mui/material/Container";

import { paths } from "@/routes/paths";

import { useSettingsContext } from "@/components/settings";
import CustomBreadcrumbs from "@/components/custom-breadcrumbs";

import { useGetPrefectures } from "@/api/prefecture";

import GovernmentCityNewEditForm from "../government-city-new-edit-form";

// ----------------------------------------------------------------------

export default function GovernmentCityCreateView() {
  const settings = useSettingsContext();

  const { prefectures } = useGetPrefectures();

  return (
    <Container maxWidth={settings.themeStretch ? false : "lg"}>
      <CustomBreadcrumbs
        heading="政令指定都市マスタ作成"
        links={[
          { name: "ダッシュボード", href: paths.admin.dashboard },
          {
            name: "政令指定都市マスタ",
            href: paths.admin.governmentCity.root,
          },
          { name: "政令指定都市を作成" },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <GovernmentCityNewEditForm prefectures={prefectures} />
    </Container>
  );
}
