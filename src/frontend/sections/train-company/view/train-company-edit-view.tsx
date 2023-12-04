"use client";

import Container from "@mui/material/Container";

import { paths } from "@/routes/paths";

import { useGetTrainCompany } from "@/api/train-company";

import { useSettingsContext } from "@/components/settings";
import CustomBreadcrumbs from "@/components/custom-breadcrumbs";

import TrainCompanyNewEditForm from "../train-company-new-edit-form";

// ----------------------------------------------------------------------

type Props = {
  id: string;
};

export default function TrainCompanyEditView({ id }: Props) {
  const settings = useSettingsContext();

  const { trainCompany: currentTrainCompany } = useGetTrainCompany(id);

  return (
    <Container maxWidth={settings.themeStretch ? false : "lg"}>
      <CustomBreadcrumbs
        heading="鉄道事業者マスタ編集"
        links={[
          { name: "ダッシュボード", href: paths.admin.dashboard },
          {
            name: "鉄道事業者マスタ",
            href: paths.admin.trainCompany.root,
          },
          { name: currentTrainCompany?.name },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <TrainCompanyNewEditForm currentTrainCompany={currentTrainCompany} />
    </Container>
  );
}
