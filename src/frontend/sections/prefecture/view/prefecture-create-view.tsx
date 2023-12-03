"use client";

import Container from "@mui/material/Container";

import { paths } from "@/routes/paths";

import { useSettingsContext } from "@/components/settings";
import CustomBreadcrumbs from "@/components/custom-breadcrumbs";

import PrefectureNewEditForm from "../prefecture-new-edit-form";

// ----------------------------------------------------------------------

export default function PrefectureCreateView() {
  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : "lg"}>
      <CustomBreadcrumbs
        heading="都道府県マスタ作成"
        links={[
          { name: "ダッシュボード", href: paths.admin.dashboard },
          {
            name: "都道府県マスタ",
            href: paths.admin.prefecture.root,
          },
          { name: "都道府県を作成" },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <PrefectureNewEditForm />
    </Container>
  );
}
