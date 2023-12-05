"use client";

import Container from "@mui/material/Container";

import { paths } from "@/routes/paths";

import { useSettingsContext } from "@/components/settings";
import CustomBreadcrumbs from "@/components/custom-breadcrumbs";

import HolidayNewEditForm from "../holiday-new-edit-form";

// ----------------------------------------------------------------------

export default function HolidayCreateView() {
  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : "lg"}>
      <CustomBreadcrumbs
        heading="休日マスタ作成"
        links={[
          { name: "ダッシュボード", href: paths.admin.dashboard },
          {
            name: "休日マスタ",
            href: paths.admin.holiday.root,
          },
          { name: "休日を作成" },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <HolidayNewEditForm />
    </Container>
  );
}
