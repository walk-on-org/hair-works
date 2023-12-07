"use client";

import Container from "@mui/material/Container";

import { paths } from "@/routes/paths";

import { useGetAdKeyword } from "@/api/ad-keyword";

import { useSettingsContext } from "@/components/settings";
import CustomBreadcrumbs from "@/components/custom-breadcrumbs";

import AdKeywordNewEditForm from "../ad-keyword-new-edit-form";

// ----------------------------------------------------------------------

type Props = {
  id: string;
};

export default function AdKeywordEditView({ id }: Props) {
  const settings = useSettingsContext();

  const { adKeyword: currentAdKeyword } = useGetAdKeyword(id);

  return (
    <Container maxWidth={settings.themeStretch ? false : "lg"}>
      <CustomBreadcrumbs
        heading="広告キーワードマスタ編集"
        links={[
          { name: "ダッシュボード", href: paths.admin.dashboard },
          {
            name: "広告キーワードマスタ",
            href: paths.admin.adKeyword.root,
          },
          { name: `# ${currentAdKeyword?.id}` },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <AdKeywordNewEditForm currentAdKeyword={currentAdKeyword} />
    </Container>
  );
}
