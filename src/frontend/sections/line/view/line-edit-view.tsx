"use client";

import Container from "@mui/material/Container";

import { paths } from "@/routes/paths";

import { useGetLine } from "@/api/line";
import { useGetTrainCompanies } from "@/api/train-company";

import { useSettingsContext } from "@/components/settings";
import CustomBreadcrumbs from "@/components/custom-breadcrumbs";

import LineNewEditForm from "../line-new-edit-form";

// ----------------------------------------------------------------------

type Props = {
  id: string;
};

export default function LineEditView({ id }: Props) {
  const settings = useSettingsContext();

  const { line: currentLine } = useGetLine(id);
  const { trainCompanies } = useGetTrainCompanies();

  return (
    <Container maxWidth={settings.themeStretch ? false : "lg"}>
      <CustomBreadcrumbs
        heading="路線マスタ編集"
        links={[
          { name: "ダッシュボード", href: paths.admin.dashboard },
          {
            name: "路線マスタ",
            href: paths.admin.line.root,
          },
          { name: currentLine?.name },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <LineNewEditForm
        currentLine={currentLine}
        trainCompanies={trainCompanies}
      />
    </Container>
  );
}
