"use client";

import Container from "@mui/material/Container";

import { paths } from "@/routes/paths";

import { useGetCorporation } from "@/api/corporation";
import { useGetPrefectures } from "@/api/prefecture";
import { useGetCities } from "@/api/city";

import { useSettingsContext } from "@/components/settings";
import CustomBreadcrumbs from "@/components/custom-breadcrumbs";

import CorporationNewEditForm from "../corporation-new-edit-form";

// ----------------------------------------------------------------------

type Props = {
  id: string;
};

export default function CorporationEditView({ id }: Props) {
  const settings = useSettingsContext();

  const { corporation: currentCorporation } = useGetCorporation(id);
  const { prefectures } = useGetPrefectures();
  const { cities } = useGetCities();

  return (
    <Container maxWidth={settings.themeStretch ? false : "lg"}>
      <CustomBreadcrumbs
        heading="法人編集"
        links={[
          { name: "ダッシュボード", href: paths.admin.dashboard },
          {
            name: "法人",
            href: paths.admin.corporation.root,
          },
          { name: currentCorporation?.name },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <CorporationNewEditForm
        currentCorporation={currentCorporation}
        prefectures={prefectures}
        cities={cities}
      />
    </Container>
  );
}
