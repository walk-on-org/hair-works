"use client";

import Container from "@mui/material/Container";

import { paths } from "@/routes/paths";

import { useGetMailmagazineConfig } from "@/api/mailmagazine-config";
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

type Props = {
  id: string;
};

export default function MailmagazineConfigEditView({ id }: Props) {
  const settings = useSettingsContext();

  const { mailmagazineConfig: currentMailmagazineConfig } =
    useGetMailmagazineConfig(id);
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
        heading="メルマガ設定編集"
        links={[
          { name: "ダッシュボード", href: paths.admin.dashboard },
          {
            name: "メルマガ設定",
            href: paths.admin.mailmagazineConfig.root,
          },
          { name: currentMailmagazineConfig?.title },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <MailmagazineConfigNewEditForm
        currentMailmagazineConfig={currentMailmagazineConfig}
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
