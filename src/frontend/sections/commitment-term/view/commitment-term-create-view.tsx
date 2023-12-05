"use client";

import Container from "@mui/material/Container";

import { paths } from "@/routes/paths";

import { useSettingsContext } from "@/components/settings";
import CustomBreadcrumbs from "@/components/custom-breadcrumbs";

import CommitmentTermNewEditForm from "../commitment-term-new-edit-form";

// ----------------------------------------------------------------------

export default function CommitmentTermCreateView() {
  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : "lg"}>
      <CustomBreadcrumbs
        heading="こだわり条件マスタ作成"
        links={[
          { name: "ダッシュボード", href: paths.admin.dashboard },
          {
            name: "こだわり条件マスタ",
            href: paths.admin.commitmentTerm.root,
          },
          { name: "こだわり条件を作成" },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <CommitmentTermNewEditForm />
    </Container>
  );
}
