"use client";

import Container from "@mui/material/Container";

import { paths } from "@/routes/paths";

import { useSettingsContext } from "@/components/settings";
import CustomBreadcrumbs from "@/components/custom-breadcrumbs";

import LineNewEditForm from "../line-new-edit-form";
import { useGetTrainCompanies } from "@/api/train-company";

// ----------------------------------------------------------------------

export default function LineCreateView() {
  const settings = useSettingsContext();

  const { trainCompanies } = useGetTrainCompanies();

  return (
    <Container maxWidth={settings.themeStretch ? false : "lg"}>
      <CustomBreadcrumbs
        heading="路線マスタ作成"
        links={[
          { name: "ダッシュボード", href: paths.admin.dashboard },
          {
            name: "路線マスタ",
            href: paths.admin.line.root,
          },
          { name: "路線を作成" },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <LineNewEditForm trainCompanies={trainCompanies} />
    </Container>
  );
}
