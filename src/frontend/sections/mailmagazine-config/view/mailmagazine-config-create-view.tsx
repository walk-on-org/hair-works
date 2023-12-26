"use client";

import Container from "@mui/material/Container";

import { paths } from "@/routes/paths";

import { useGetLpJobCategories } from "@/api/lp-job-category";
import { useGetPrefectures } from "@/api/prefecture";
import { useGetCities } from "@/api/city";
import { useGetEmployments } from "@/api/employment";
import { useGetQualifications } from "@/api/qualification";
import { useGetJobCategories } from "@/api/job-category";
import { useGetCorporations } from "@/api/corporation";

import { useSettingsContext } from "@/components/settings";
import CustomBreadcrumbs from "@/components/custom-breadcrumbs";

import MailmagazineConfigNewEditForm from "../mailmagazine-config-new-edit-form";

// ----------------------------------------------------------------------

export default function MailmagazineConfigCreateView() {
  const settings = useSettingsContext();

  const { lpJobCategories } = useGetLpJobCategories();
  const { prefectures } = useGetPrefectures();
  const { cities } = useGetCities();
  const { employments } = useGetEmployments();
  const { qualifications } = useGetQualifications();
  const { jobCategories } = useGetJobCategories();
  const { corporations } = useGetCorporations();

  return (
    <Container maxWidth={settings.themeStretch ? false : "lg"}>
      <CustomBreadcrumbs
        heading="メルマガ設定"
        links={[
          { name: "ダッシュボード", href: paths.admin.dashboard },
          {
            name: "求人",
            href: paths.admin.mailmagazineConfig.root,
          },
          { name: "メルマガ設定を作成" },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <MailmagazineConfigNewEditForm
        lpJobCategories={lpJobCategories}
        prefectures={prefectures}
        cities={cities}
        employments={employments}
        qualifications={qualifications}
        jobCategories={jobCategories}
        corporations={corporations}
      />
    </Container>
  );
}
