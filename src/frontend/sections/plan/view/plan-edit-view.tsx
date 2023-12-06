"use client";

import Container from "@mui/material/Container";

import { paths } from "@/routes/paths";

import { useGetPlan } from "@/api/plan";

import { useSettingsContext } from "@/components/settings";
import CustomBreadcrumbs from "@/components/custom-breadcrumbs";

import PlanNewEditForm from "../plan-new-edit-form";

// ----------------------------------------------------------------------

type Props = {
  id: string;
};

export default function PlanEditView({ id }: Props) {
  const settings = useSettingsContext();

  const { plan: currentPlan } = useGetPlan(id);

  return (
    <Container maxWidth={settings.themeStretch ? false : "lg"}>
      <CustomBreadcrumbs
        heading="プランマスタ編集"
        links={[
          { name: "ダッシュボード", href: paths.admin.dashboard },
          {
            name: "プランマスタ",
            href: paths.admin.plan.root,
          },
          { name: currentPlan?.name },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <PlanNewEditForm currentPlan={currentPlan} />
    </Container>
  );
}
