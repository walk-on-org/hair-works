"use client";

import Container from "@mui/material/Container";

import { paths } from "@/routes/paths";

import { useGetMember, useGetMembers } from "@/api/member";
import { useGetQualifications } from "@/api/qualification";
import { useGetLpJobCategories } from "@/api/lp-job-category";
import { useGetPrefectures } from "@/api/prefecture";
import { useGetEmployments } from "@/api/employment";

import { useSettingsContext } from "@/components/settings";
import CustomBreadcrumbs from "@/components/custom-breadcrumbs";

import MemberEditForm from "../member-edit-form";

// ----------------------------------------------------------------------

type Props = {
  id: string;
};

export default function MemberEditView({ id }: Props) {
  const settings = useSettingsContext();

  const { member: currentMember } = useGetMember(id);
  const { prefectures } = useGetPrefectures();
  const { employments } = useGetEmployments();
  const { qualifications } = useGetQualifications();
  const { lpJobCategories } = useGetLpJobCategories();
  const { members } = useGetMembers();

  return (
    <Container maxWidth={settings.themeStretch ? false : "lg"}>
      <CustomBreadcrumbs
        heading="会員情報編集"
        links={[
          { name: "ダッシュボード", href: paths.admin.dashboard },
          {
            name: "会員情報",
            href: paths.admin.member.root,
          },
          { name: currentMember?.name },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <MemberEditForm
        currentMember={currentMember}
        prefectures={prefectures}
        employments={employments}
        qualifications={qualifications}
        lpJobCategories={lpJobCategories}
        members={members}
      />
    </Container>
  );
}
