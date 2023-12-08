"use client";

import Container from "@mui/material/Container";

import { paths } from "@/routes/paths";

import { useGetHtmlAddContent } from "@/api/html-add-content";
import { useGetGovernmentCities } from "@/api/government-city";
import { useGetPrefectures } from "@/api/prefecture";

import { useSettingsContext } from "@/components/settings";
import CustomBreadcrumbs from "@/components/custom-breadcrumbs";

import HtmlAddContentNewEditForm from "../html-add-content-new-edit-form";

// ----------------------------------------------------------------------

type Props = {
  id: string;
};

export default function HtmlAddContentEditView({ id }: Props) {
  const settings = useSettingsContext();

  const { htmlAddContent: currentHtmlAddContent } = useGetHtmlAddContent(id);
  const { governmentCities } = useGetGovernmentCities();
  const { prefectures } = useGetPrefectures();

  return (
    <Container maxWidth={settings.themeStretch ? false : "lg"}>
      <CustomBreadcrumbs
        heading="HTML追加コンテンツ編集"
        links={[
          { name: "ダッシュボード", href: paths.admin.dashboard },
          {
            name: "HTML追加コンテンツ",
            href: paths.admin.htmlAddContent.root,
          },
          { name: `# ${currentHtmlAddContent?.id}` },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <HtmlAddContentNewEditForm
        currentHtmlAddContent={currentHtmlAddContent}
        prefectures={prefectures}
        governmentCities={governmentCities}
      />
    </Container>
  );
}
