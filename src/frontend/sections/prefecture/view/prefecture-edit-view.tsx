"use client";

import Container from "@mui/material/Container";

import { paths } from "@/routes/paths";

import { useGetPrefecture } from "@/api/prefecture";

import { useSettingsContext } from "@/components/settings";
import CustomBreadcrumbs from "@/components/custom-breadcrumbs";

import PrefectureNewEditForm from "../prefecture-new-edit-form";

// ----------------------------------------------------------------------

type Props = {
  id: string;
};

export default function PrefectureEditView({ id }: Props) {
  const settings = useSettingsContext();

  const { prefecture: currentPrefecture } = useGetPrefecture(id);

  return (
    <Container maxWidth={settings.themeStretch ? false : "lg"}>
      <CustomBreadcrumbs
        heading="都道府県マスタ編集"
        links={[
          { name: "ダッシュボード", href: paths.admin.dashboard },
          {
            name: "都道府県マスタ",
            href: paths.admin.prefecture.root,
          },
          { name: currentPrefecture?.name },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <PrefectureNewEditForm currentPrefecture={currentPrefecture} />
    </Container>
  );
}
