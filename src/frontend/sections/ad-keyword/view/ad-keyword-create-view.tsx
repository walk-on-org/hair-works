"use client";

import Container from "@mui/material/Container";

import { paths } from "@/routes/paths";

import { useSettingsContext } from "@/components/settings";
import CustomBreadcrumbs from "@/components/custom-breadcrumbs";

import AdKeywordNewEditForm from "../ad-keyword-new-edit-form";

// ----------------------------------------------------------------------

export default function AdKeywordCreateView() {
  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : "lg"}>
      <CustomBreadcrumbs
        heading="広告キーワードマスタ作成"
        links={[
          { name: "ダッシュボード", href: paths.admin.dashboard },
          {
            name: "広告キーワードマスタ",
            href: paths.admin.adKeyword.root,
          },
          { name: "広告キーワードを作成" },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <AdKeywordNewEditForm />
    </Container>
  );
}
