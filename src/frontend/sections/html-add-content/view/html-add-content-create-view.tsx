"use client";

import Container from "@mui/material/Container";

import { paths } from "@/routes/paths";

import { useSettingsContext } from "@/components/settings";
import CustomBreadcrumbs from "@/components/custom-breadcrumbs";

import { useGetPrefectures } from "@/api/prefecture";
import { useGetGovernmentCities } from "@/api/government-city";
import { useGetCities } from "@/api/city";
import { useGetStations } from "@/api/station";

import HtmlAddContentNewEditForm from "../html-add-content-new-edit-form";

// ----------------------------------------------------------------------

export default function HtmlAddContentCreateView() {
  const settings = useSettingsContext();

  const { prefectures } = useGetPrefectures();
  const { governmentCities } = useGetGovernmentCities();
  const { cities } = useGetCities();
  const { stations } = useGetStations();

  return (
    <Container maxWidth={settings.themeStretch ? false : "lg"}>
      <CustomBreadcrumbs
        heading="HTML追加コンテンツ作成"
        links={[
          { name: "ダッシュボード", href: paths.admin.dashboard },
          {
            name: "HTML追加コンテンツ",
            href: paths.admin.htmlAddContent.root,
          },
          { name: "HTML追加コンテンツを作成" },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <HtmlAddContentNewEditForm
        prefectures={prefectures}
        governmentCities={governmentCities}
        cities={cities}
        stations={stations}
      />
    </Container>
  );
}
