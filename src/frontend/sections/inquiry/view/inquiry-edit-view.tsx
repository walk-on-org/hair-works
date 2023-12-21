"use client";

import Container from "@mui/material/Container";

import { paths } from "@/routes/paths";

import { useGetInquiry } from "@/api/inquiry";

import { useSettingsContext } from "@/components/settings";
import CustomBreadcrumbs from "@/components/custom-breadcrumbs";

import InquiryEditForm from "../inquiry-edit-form";

// ----------------------------------------------------------------------

type Props = {
  id: string;
};

export default function InquiryEditView({ id }: Props) {
  const settings = useSettingsContext();

  const { inquiry: currentInquiry } = useGetInquiry(id);

  return (
    <Container maxWidth={settings.themeStretch ? false : "lg"}>
      <CustomBreadcrumbs
        heading="問い合わせ編集"
        links={[
          { name: "ダッシュボード", href: paths.admin.dashboard },
          {
            name: "問い合わせ",
            href: paths.admin.inquiry.root,
          },
          { name: currentInquiry?.name },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <InquiryEditForm currentInquiry={currentInquiry} />
    </Container>
  );
}
