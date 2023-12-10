"use client";

import Container from "@mui/material/Container";

import { paths } from "@/routes/paths";

import { useGetEmployment } from "@/api/employment";
import { useGetPositions } from "@/api/position";
import { useGetCommitmentTerms } from "@/api/commitment-term";

import { useSettingsContext } from "@/components/settings";
import CustomBreadcrumbs from "@/components/custom-breadcrumbs";

import EmploymentNewEditForm from "../employment-new-edit-form";

// ----------------------------------------------------------------------

type Props = {
  id: string;
};

export default function EmploymentEditView({ id }: Props) {
  const settings = useSettingsContext();

  const { employment: currentEmployment } = useGetEmployment(id);
  const { positions } = useGetPositions();
  const { commitmentTerms } = useGetCommitmentTerms();

  return (
    <Container maxWidth={settings.themeStretch ? false : "lg"}>
      <CustomBreadcrumbs
        heading="雇用形態マスタ編集"
        links={[
          { name: "ダッシュボード", href: paths.admin.dashboard },
          {
            name: "雇用形態マスタ",
            href: paths.admin.employment.root,
          },
          { name: currentEmployment?.name },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <EmploymentNewEditForm
        currentEmployment={currentEmployment}
        positions={positions}
        commitmentTerms={commitmentTerms}
      />
    </Container>
  );
}
