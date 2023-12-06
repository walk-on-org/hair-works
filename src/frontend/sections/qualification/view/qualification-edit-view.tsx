"use client";

import Container from "@mui/material/Container";

import { paths } from "@/routes/paths";

import { useGetQualification } from "@/api/qualification";

import { useSettingsContext } from "@/components/settings";
import CustomBreadcrumbs from "@/components/custom-breadcrumbs";

import QualificationNewEditForm from "../qualification-new-edit-form";

// ----------------------------------------------------------------------

type Props = {
  id: string;
};

export default function QualificationEditView({ id }: Props) {
  const settings = useSettingsContext();

  const { qualification: currentQualification } = useGetQualification(id);

  return (
    <Container maxWidth={settings.themeStretch ? false : "lg"}>
      <CustomBreadcrumbs
        heading="保有資格マスタ編集"
        links={[
          { name: "ダッシュボード", href: paths.admin.dashboard },
          {
            name: "保有資格マスタ",
            href: paths.admin.qualification.root,
          },
          { name: currentQualification?.name },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <QualificationNewEditForm currentQualification={currentQualification} />
    </Container>
  );
}
