"use client";

import Container from "@mui/material/Container";

import { paths } from "@/routes/paths";

import { useGetOffice } from "@/api/office";
import { useGetCorporations } from "@/api/corporation";
import { useGetPrefectures } from "@/api/prefecture";
import { useGetCities } from "@/api/city";

import { useSettingsContext } from "@/components/settings";
import CustomBreadcrumbs from "@/components/custom-breadcrumbs";

import OfficeNewEditForm from "../office-new-edit-form";

// ----------------------------------------------------------------------

type Props = {
  id: string;
};

export default function OfficeEditView({ id }: Props) {
  const settings = useSettingsContext();

  const { office: currentOffice } = useGetOffice(id);
  const { corporations } = useGetCorporations();
  const { prefectures } = useGetPrefectures();
  const { cities } = useGetCities();

  return (
    <Container maxWidth={settings.themeStretch ? false : "lg"}>
      <CustomBreadcrumbs
        heading="事業所編集"
        links={[
          { name: "ダッシュボード", href: paths.admin.dashboard },
          {
            name: "事業所",
            href: paths.admin.office.root,
          },
          { name: currentOffice?.name },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <OfficeNewEditForm
        currentOffice={currentOffice}
        corporations={corporations}
        prefectures={prefectures}
        cities={cities}
      />
    </Container>
  );
}
