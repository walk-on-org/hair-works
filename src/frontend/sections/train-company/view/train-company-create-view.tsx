"use client";

import Container from "@mui/material/Container";

import { paths } from "@/routes/paths";

import { useSettingsContext } from "@/components/settings";
import CustomBreadcrumbs from "@/components/custom-breadcrumbs";

import TrainCompanyNewEditForm from "../train-company-new-edit-form";

// ----------------------------------------------------------------------

export default function TrainCompanyCreateView() {
  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : "lg"}>
      <CustomBreadcrumbs
        heading="鉄道事業者マスタ作成"
        links={[
          { name: "ダッシュボード", href: paths.admin.dashboard },
          {
            name: "鉄道事業者マスタ",
            href: paths.admin.trainCompany.root,
          },
          { name: "鉄道事業者を作成" },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <TrainCompanyNewEditForm />
    </Container>
  );
}
