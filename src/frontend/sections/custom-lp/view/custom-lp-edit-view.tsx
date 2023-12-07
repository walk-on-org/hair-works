"use client";

import Container from "@mui/material/Container";

import { paths } from "@/routes/paths";

import { useGetCustomLp } from "@/api/custom-lp";

import { useSettingsContext } from "@/components/settings";
import CustomBreadcrumbs from "@/components/custom-breadcrumbs";

import CustomLpNewEditForm from "../custom-lp-new-edit-form";

// ----------------------------------------------------------------------

type Props = {
  id: string;
};

export default function CustomLpEditView({ id }: Props) {
  const settings = useSettingsContext();

  const { customLp: currentCustomLp } = useGetCustomLp(id);

  return (
    <Container maxWidth={settings.themeStretch ? false : "lg"}>
      <CustomBreadcrumbs
        heading="専用LP設定編集"
        links={[
          { name: "ダッシュボード", href: paths.admin.dashboard },
          {
            name: "専用LP設定",
            href: paths.admin.customLp.root,
          },
          { name: currentCustomLp?.title },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <CustomLpNewEditForm currentCustomLp={currentCustomLp} />
    </Container>
  );
}
