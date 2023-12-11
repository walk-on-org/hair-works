"use client";

import Container from "@mui/material/Container";

import { paths } from "@/routes/paths";

import { useGetPrefectures } from "@/api/prefecture";
import { useGetCities } from "@/api/city";

import { useSettingsContext } from "@/components/settings";
import CustomBreadcrumbs from "@/components/custom-breadcrumbs";

import CorporationNewEditForm from "../corporation-new-edit-form";

// ----------------------------------------------------------------------

export default function CorporationCreateView() {
  const settings = useSettingsContext();

  const { prefectures } = useGetPrefectures();
  const { cities } = useGetCities();

  return (
    <Container maxWidth={settings.themeStretch ? false : "lg"}>
      <CustomBreadcrumbs
        heading="法人作成"
        links={[
          { name: "ダッシュボード", href: paths.admin.dashboard },
          {
            name: "法人",
            href: paths.admin.corporation.root,
          },
          { name: "法人を作成" },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <CorporationNewEditForm prefectures={prefectures} cities={cities} />
    </Container>
  );
}
