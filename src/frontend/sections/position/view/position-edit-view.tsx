"use client";

import Container from "@mui/material/Container";

import { paths } from "@/routes/paths";

import { useGetPosition } from "@/api/position";

import { useSettingsContext } from "@/components/settings";
import CustomBreadcrumbs from "@/components/custom-breadcrumbs";

import PositionNewEditForm from "../position-new-edit-form";

// ----------------------------------------------------------------------

type Props = {
  id: string;
};

export default function PositionEditView({ id }: Props) {
  const settings = useSettingsContext();

  const { position: currentPosition } = useGetPosition(id);

  return (
    <Container maxWidth={settings.themeStretch ? false : "lg"}>
      <CustomBreadcrumbs
        heading="役職/役割マスタ編集"
        links={[
          { name: "ダッシュボード", href: paths.admin.dashboard },
          {
            name: "役職/役割マスタ",
            href: paths.admin.position.root,
          },
          { name: currentPosition?.name },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <PositionNewEditForm currentPosition={currentPosition} />
    </Container>
  );
}
