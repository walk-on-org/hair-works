"use client";

import Grid from "@mui/material/Unstable_Grid2";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";

import { useSettingsContext } from "@/components/settings";
import DashboardHorizontalBarGraph from "../dashboard-horizontal-bar-graph";
import DashboardWidgetSummary from "../dashboard-widget-summary";
import DashboardVerticalBarGraph from "../dashboard-vertical-bar-graph";

// ----------------------------------------------------------------------

export default function DashboardView() {
  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : "xl"}>
      <Typography
        variant="h4"
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      >
        ダッシュボード
      </Typography>

      <Grid container spacing={3}>
        <Grid xs={12} sm={6} md={3}>
          <DashboardWidgetSummary
            title="掲載求人"
            total={14200}
            icon={<img alt="icon" src="/assets/icons/glass/ic_glass_bag.png" />}
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <DashboardWidgetSummary
            title="会員登録数（今月）"
            total={200}
            color="info"
            icon={
              <img alt="icon" src="/assets/icons/glass/ic_glass_users.png" />
            }
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <DashboardWidgetSummary
            title="応募数（今月）"
            total={100}
            color="warning"
            icon={
              <img alt="icon" src="/assets/icons/glass/ic_glass_users.png" />
            }
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <DashboardWidgetSummary
            title="問い合わせ数（今月）"
            total={10}
            color="error"
            icon={<img alt="icon" src="/assets/icons/glass/ic_glass_bag.png" />}
          />
        </Grid>

        <Grid xs={12} md={6} lg={6}>
          <DashboardHorizontalBarGraph
            title="都道府県別の掲載中求人"
            chart={{
              series: [
                { label: "Italy", value: 400 },
                { label: "Japan", value: 430 },
                { label: "China", value: 448 },
                { label: "Canada", value: 470 },
                { label: "France", value: 540 },
                { label: "Germany", value: 580 },
                { label: "South Korea", value: 690 },
                { label: "Netherlands", value: 1100 },
                { label: "United States", value: 1200 },
                { label: "United Kingdom", value: 1380 },
              ],
            }}
          />
        </Grid>

        <Grid xs={12} md={6} lg={6}>
          <DashboardVerticalBarGraph
            title="月別応募数"
            chart={{
              categories: [
                "1月",
                "2月",
                "3月",
                "4月",
                "5月",
                "6月",
                "7月",
                "8月",
                "9月",
                "10月",
                "11月",
                "12月",
              ],
              series: [
                {
                  name: "2022年",
                  data: [10, 34, 13, 56, 77, 88, 99, 77, 45, 99, 77, 45],
                },
                {
                  name: "2023年",
                  data: [148, 91, 69, 62, 49, 51, 35, 41, 10, 35, 41, 10],
                },
              ],
            }}
          />
        </Grid>
      </Grid>
    </Container>
  );
}
