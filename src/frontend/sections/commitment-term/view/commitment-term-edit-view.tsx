"use client";

import Container from "@mui/material/Container";

import { paths } from "@/routes/paths";

import { useGetCommitmentTerm } from "@/api/commitment-term";

import { useSettingsContext } from "@/components/settings";
import CustomBreadcrumbs from "@/components/custom-breadcrumbs";

import CommitmentTermNewEditForm from "../commitment-term-new-edit-form";

// ----------------------------------------------------------------------

type Props = {
  id: string;
};

export default function CommitmentTermEditView({ id }: Props) {
  const settings = useSettingsContext();

  const { commitmentTerm: currentCommitmentTerm } = useGetCommitmentTerm(id);

  return (
    <Container maxWidth={settings.themeStretch ? false : "lg"}>
      <CustomBreadcrumbs
        heading="こだわり条件マスタ編集"
        links={[
          { name: "ダッシュボード", href: paths.admin.dashboard },
          {
            name: "こだわり条件マスタ",
            href: paths.admin.holiday.root,
          },
          { name: currentCommitmentTerm?.name },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <CommitmentTermNewEditForm
        currentCommitmentTerm={currentCommitmentTerm}
      />
    </Container>
  );
}
