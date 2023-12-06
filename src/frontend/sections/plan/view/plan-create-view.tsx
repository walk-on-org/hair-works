"use client";

import Container from "@mui/material/Container";

import { paths } from "@/routes/paths";

import { useSettingsContext } from "@/components/settings";
import CustomBreadcrumbs from "@/components/custom-breadcrumbs";

import PlanNewEditForm from "../plan-new-edit-form";

// ----------------------------------------------------------------------

export default function PlanCreateView() {
  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : "lg"}>
      <CustomBreadcrumbs
        heading="プランマスタ作成"
        links={[
          { name: "ダッシュボード", href: paths.admin.dashboard },
          {
            name: "プランマスタ",
            href: paths.admin.plan.root,
          },
          { name: "プランを作成" },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <PlanNewEditForm />
    </Container>
  );
}
