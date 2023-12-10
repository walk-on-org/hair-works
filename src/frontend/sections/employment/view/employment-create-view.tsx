"use client";

import Container from "@mui/material/Container";

import { paths } from "@/routes/paths";

import { useGetPositions } from "@/api/position";
import { useGetCommitmentTerms } from "@/api/commitment-term";

import { useSettingsContext } from "@/components/settings";
import CustomBreadcrumbs from "@/components/custom-breadcrumbs";

import EmploymentNewEditForm from "../employment-new-edit-form";

// ----------------------------------------------------------------------

export default function EmploymentCreateView() {
  const settings = useSettingsContext();

  const { positions } = useGetPositions();
  const { commitmentTerms } = useGetCommitmentTerms();

  return (
    <Container maxWidth={settings.themeStretch ? false : "lg"}>
      <CustomBreadcrumbs
        heading="雇用形態マスタ作成"
        links={[
          { name: "ダッシュボード", href: paths.admin.dashboard },
          {
            name: "雇用形態マスタ",
            href: paths.admin.employment.root,
          },
          { name: "雇用形態を作成" },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <EmploymentNewEditForm
        positions={positions}
        commitmentTerms={commitmentTerms}
      />
    </Container>
  );
}
