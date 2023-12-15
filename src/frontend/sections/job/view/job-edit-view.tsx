"use client";

import Container from "@mui/material/Container";

import { paths } from "@/routes/paths";

import { useGetJob } from "@/api/job";
import { useGetOffices } from "@/api/office";
import { useGetJobCategories } from "@/api/job-category";
import { useGetPositions } from "@/api/position";
import { useGetEmployments } from "@/api/employment";
import { useGetCommitmentTerms } from "@/api/commitment-term";
import { useGetQualifications } from "@/api/qualification";
import { useGetHolidays } from "@/api/holiday";

import { useSettingsContext } from "@/components/settings";
import CustomBreadcrumbs from "@/components/custom-breadcrumbs";

import JobNewEditForm from "../job-new-edit-form";

// ----------------------------------------------------------------------

type Props = {
  id: string;
};

export default function JobEditView({ id }: Props) {
  const settings = useSettingsContext();

  const { job: currentJob } = useGetJob(id);
  const { offices } = useGetOffices();
  const { jobCategories } = useGetJobCategories();
  const { positions } = useGetPositions();
  const { employments } = useGetEmployments();
  const { commitmentTerms } = useGetCommitmentTerms();
  const { holidays } = useGetHolidays();
  const { qualifications } = useGetQualifications();

  return (
    <Container maxWidth={settings.themeStretch ? false : "lg"}>
      <CustomBreadcrumbs
        heading="求人編集"
        links={[
          { name: "ダッシュボード", href: paths.admin.dashboard },
          {
            name: "求人",
            href: paths.admin.job.root,
          },
          { name: currentJob?.name },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <JobNewEditForm
        currentJob={currentJob}
        offices={offices}
        jobCategories={jobCategories}
        positions={positions}
        employments={employments}
        commitmentTerms={commitmentTerms}
        holidays={holidays}
        qualifications={qualifications}
      />
    </Container>
  );
}
