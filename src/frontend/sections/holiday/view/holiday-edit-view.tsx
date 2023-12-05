"use client";

import Container from "@mui/material/Container";

import { paths } from "@/routes/paths";

import { useGetHoliday } from "@/api/holiday";

import { useSettingsContext } from "@/components/settings";
import CustomBreadcrumbs from "@/components/custom-breadcrumbs";

import HolidayNewEditForm from "../holiday-new-edit-form";

// ----------------------------------------------------------------------

type Props = {
  id: string;
};

export default function HolidayEditView({ id }: Props) {
  const settings = useSettingsContext();

  const { holiday: currentHoliday } = useGetHoliday(id);

  return (
    <Container maxWidth={settings.themeStretch ? false : "lg"}>
      <CustomBreadcrumbs
        heading="休日マスタ編集"
        links={[
          { name: "ダッシュボード", href: paths.admin.dashboard },
          {
            name: "休日マスタ",
            href: paths.admin.holiday.root,
          },
          { name: currentHoliday?.name },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <HolidayNewEditForm currentHoliday={currentHoliday} />
    </Container>
  );
}
