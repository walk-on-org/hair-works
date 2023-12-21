"use client";

import Container from "@mui/material/Container";

import { paths } from "@/routes/paths";

import { useGetApplicant } from "@/api/applicant";

import { useSettingsContext } from "@/components/settings";
import CustomBreadcrumbs from "@/components/custom-breadcrumbs";

import ApplicantEditForm from "../applicant-edit-form";

// ----------------------------------------------------------------------

type Props = {
  id: string;
};

export default function ApplicantEditView({ id }: Props) {
  const settings = useSettingsContext();

  const { applicant: currentApplicant } = useGetApplicant(id);

  return (
    <Container maxWidth={settings.themeStretch ? false : "lg"}>
      <CustomBreadcrumbs
        heading="応募者編集"
        links={[
          { name: "ダッシュボード", href: paths.admin.dashboard },
          {
            name: "応募者",
            href: paths.admin.applicant.root,
          },
          { name: currentApplicant?.name },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <ApplicantEditForm currentApplicant={currentApplicant} />
    </Container>
  );
}
