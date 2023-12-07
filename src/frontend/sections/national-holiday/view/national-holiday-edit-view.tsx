"use client";

import Container from "@mui/material/Container";

import { paths } from "@/routes/paths";

import { useGetNationalHoliday } from "@/api/national-holiday";

import { useSettingsContext } from "@/components/settings";
import CustomBreadcrumbs from "@/components/custom-breadcrumbs";

import NationalHolidayNewEditForm from "../national-holiday-new-edit-form";

// ----------------------------------------------------------------------

type Props = {
  id: string;
};

export default function NationalHolidayEditView({ id }: Props) {
  const settings = useSettingsContext();

  const { nationalHoliday: currentNationalHoliday } = useGetNationalHoliday(id);

  return (
    <Container maxWidth={settings.themeStretch ? false : "lg"}>
      <CustomBreadcrumbs
        heading="祝日マスタ編集"
        links={[
          { name: "ダッシュボード", href: paths.admin.dashboard },
          {
            name: "祝日マスタ",
            href: paths.admin.nationalHoliday.root,
          },
          { name: currentNationalHoliday?.name },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <NationalHolidayNewEditForm
        currentNationalHoliday={currentNationalHoliday}
      />
    </Container>
  );
}
