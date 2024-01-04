"use client";

import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";

import { paths } from "@/routes/paths";
import { RouterLink } from "@/routes/components";

import { useGetPlan } from "@/api/plan";

import Label from "@/components/label";
import CustomBreadcrumbs from "@/components/custom-breadcrumbs";
import Iconify from "@/components/iconify";
import EmptyContent from "@/components/empty-content";
import { useSettingsContext } from "@/components/settings";

import PlanDetailToolbar from "../plan-detail-toolbar";
import { PlanDetailSkeleton } from "../plan-skelton";
import { fCurrency } from "@/utils/format-number";

// ----------------------------------------------------------------------

type Props = {
  id: string;
};

export default function PlanDetailView({ id }: Props) {
  const { plan, planLoading, planError } = useGetPlan(id);

  const settings = useSettingsContext();

  const renderSkeleton = <PlanDetailSkeleton />;

  const renderError = (
    <EmptyContent
      filled
      title={`${planError?.message}`}
      action={
        <Button
          component={RouterLink}
          href={paths.admin.plan.root}
          startIcon={<Iconify icon="eva:arrow-ios-back-fill" width={16} />}
          sx={{ mt: 3 }}
        >
          一覧へ戻る
        </Button>
      }
      sx={{ py: 10 }}
    />
  );

  const renderPlan = plan && (
    <>
      <CustomBreadcrumbs
        heading="プランマスタ詳細"
        links={[
          { name: "ダッシュボード", href: paths.admin.dashboard },
          {
            name: "プランマスタ",
            href: paths.admin.plan.root,
          },
          { name: plan?.name },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <PlanDetailToolbar
        backLink={paths.admin.plan.root}
        editLink={paths.admin.plan.edit(`${plan?.id}`)}
      />

      <Card>
        <Stack spacing={3} sx={{ p: 2 }}>
          <Stack
            direction={{
              xs: "column",
              md: "row",
            }}
            rowGap={1}
          >
            <Typography variant="subtitle2" sx={{ width: 160 }}>
              プラン名
            </Typography>
            <Typography variant="body2" sx={{ flexGrow: 1 }}>
              {plan.name}
            </Typography>
          </Stack>

          <Stack
            direction={{
              xs: "column",
              md: "row",
            }}
            rowGap={1}
          >
            <Typography variant="subtitle2" sx={{ width: 160 }}>
              期間(月数)
            </Typography>
            <Typography variant="body2" sx={{ flexGrow: 1 }}>
              {plan.term}
            </Typography>
          </Stack>

          <Stack
            direction={{
              xs: "column",
              md: "row",
            }}
            rowGap={1}
          >
            <Typography variant="subtitle2" sx={{ width: 160 }}>
              金額
            </Typography>
            <Typography variant="body2" sx={{ flexGrow: 1 }}>
              {fCurrency(plan.amount)}円
            </Typography>
          </Stack>

          <Stack
            direction={{
              xs: "column",
              md: "row",
            }}
            rowGap={1}
          >
            <Typography variant="subtitle2" sx={{ width: 160 }}>
              状態
            </Typography>
            <Label
              variant="soft"
              color={(plan.status == "1" && "info") || "default"}
              width="fit-content"
            >
              {plan.status_name}
            </Label>
          </Stack>
        </Stack>
      </Card>
    </>
  );

  return (
    <Container maxWidth={settings.themeStretch ? false : "lg"}>
      {planLoading && renderSkeleton}

      {planError && renderError}

      {plan && renderPlan}
    </Container>
  );
}
