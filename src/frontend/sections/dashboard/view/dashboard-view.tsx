"use client";

import Grid from "@mui/material/Unstable_Grid2";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";

import { useSettingsContext } from "@/components/settings";
import DashboardHorizontalBarGraph from "../dashboard-horizontal-bar-graph";
import DashboardWidgetSummary from "../dashboard-widget-summary";
import DashboardVerticalBarGraph from "../dashboard-vertical-bar-graph";
import {
  useGetApplicantCount,
  useGetInquiryCount,
  useGetJobCount,
  useGetMemberCount,
} from "@/api/dashboard";
import DashboardGraphEveryYear from "../dashboard-graph-every-year";
import DashboardApplicantCountTableEveryCorporation from "../dashboard-applicant-count-table-every-corporation";
import DashboardMemberDeploymentTable from "../dashboard-member-deployment-table";

// ----------------------------------------------------------------------

export default function DashboardView() {
  const settings = useSettingsContext();

  const { jobCountEveryStatus, jobCountEveryPrefecture, publishJobCount } =
    useGetJobCount();
  const {
    memberCountThisMonth,
    memberCountOneYearAgo,
    memberCountEveryYearRoot,
    memberDeploymentEveryMonthByGoogleAll,
    memberDeploymentEveryMonthByGoogle,
    memberDeploymentEveryMonthByGoogleHairmake,
    memberDeploymentEveryMonthByGoogleEyelist,
    memberDeploymentEveryMonthByGoogleColorlist,
    memberDeploymentEveryMonthByYahoo,
    memberDeploymentEveryMonthByGoogleAgent,
  } = useGetMemberCount();
  const {
    applicantCountEveryYear,
    applicantCountThisMonth,
    applicantCountOneYearAgo,
    applicantCountEveryYearRoot,
    applicantCountEveryCorporation,
  } = useGetApplicantCount();
  const {
    inquiryCountEveryYear,
    inquiryCountThisMonth,
    inquiryCountOneYearAgo,
  } = useGetInquiryCount();

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
            title="掲載中求人"
            total={publishJobCount}
            chart={{ series: [] }}
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <DashboardWidgetSummary
            title="会員登録数（今月）"
            total={memberCountThisMonth}
            chart={{ series: memberCountOneYearAgo }}
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <DashboardWidgetSummary
            title="応募数（今月）"
            total={applicantCountThisMonth}
            chart={{ series: applicantCountOneYearAgo }}
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <DashboardWidgetSummary
            title="問合せ数（今月）"
            total={inquiryCountThisMonth}
            chart={{ series: inquiryCountOneYearAgo }}
          />
        </Grid>

        <Grid xs={12}>
          <DashboardMemberDeploymentTable
            title="経路・月別会員登録展開率（Google全て）"
            tableLabels={[
              { id: "deployment", label: "展開", minWidth: 120 },
            ].concat(
              memberDeploymentEveryMonthByGoogleAll.map((row) => {
                return {
                  id: row.created_ym,
                  label:
                    row.created_ym.substring(0, 4) +
                    "/" +
                    row.created_ym.substring(4),
                  minWidth: 100,
                };
              })
            )}
            tableData={memberDeploymentEveryMonthByGoogleAll}
            expanded={true}
          />
        </Grid>

        <Grid xs={12}>
          <DashboardMemberDeploymentTable
            title="経路・月別会員登録展開率（Googleヘアメイク、アイリスト、カラーリスト除く）"
            tableLabels={[
              { id: "deployment", label: "展開", minWidth: 120 },
            ].concat(
              memberDeploymentEveryMonthByGoogle.map((row) => {
                return {
                  id: row.created_ym,
                  label:
                    row.created_ym.substring(0, 4) +
                    "/" +
                    row.created_ym.substring(4),
                  minWidth: 100,
                };
              })
            )}
            tableData={memberDeploymentEveryMonthByGoogle}
          />
        </Grid>

        <Grid xs={12}>
          <DashboardMemberDeploymentTable
            title="経路・月別会員登録展開率（Googleヘアメイク）"
            tableLabels={[
              { id: "deployment", label: "展開", minWidth: 120 },
            ].concat(
              memberDeploymentEveryMonthByGoogleHairmake.map((row) => {
                return {
                  id: row.created_ym,
                  label:
                    row.created_ym.substring(0, 4) +
                    "/" +
                    row.created_ym.substring(4),
                  minWidth: 100,
                };
              })
            )}
            tableData={memberDeploymentEveryMonthByGoogleHairmake}
          />
        </Grid>

        <Grid xs={12}>
          <DashboardMemberDeploymentTable
            title="経路・月別会員登録展開率（Googleアイリスト）"
            tableLabels={[
              { id: "deployment", label: "展開", minWidth: 120 },
            ].concat(
              memberDeploymentEveryMonthByGoogleEyelist.map((row) => {
                return {
                  id: row.created_ym,
                  label:
                    row.created_ym.substring(0, 4) +
                    "/" +
                    row.created_ym.substring(4),
                  minWidth: 100,
                };
              })
            )}
            tableData={memberDeploymentEveryMonthByGoogleEyelist}
          />
        </Grid>

        <Grid xs={12}>
          <DashboardMemberDeploymentTable
            title="経路・月別会員登録展開率（Googleカラーリスト）"
            tableLabels={[
              { id: "deployment", label: "展開", minWidth: 120 },
            ].concat(
              memberDeploymentEveryMonthByGoogleColorlist.map((row) => {
                return {
                  id: row.created_ym,
                  label:
                    row.created_ym.substring(0, 4) +
                    "/" +
                    row.created_ym.substring(4),
                  minWidth: 100,
                };
              })
            )}
            tableData={memberDeploymentEveryMonthByGoogleColorlist}
          />
        </Grid>

        <Grid xs={12}>
          <DashboardMemberDeploymentTable
            title="経路・月別会員登録展開率（Yahoo）"
            tableLabels={[
              { id: "deployment", label: "展開", minWidth: 120 },
            ].concat(
              memberDeploymentEveryMonthByYahoo.map((row) => {
                return {
                  id: row.created_ym,
                  label:
                    row.created_ym.substring(0, 4) +
                    "/" +
                    row.created_ym.substring(4),
                  minWidth: 100,
                };
              })
            )}
            tableData={memberDeploymentEveryMonthByYahoo}
          />
        </Grid>

        <Grid xs={12}>
          <DashboardMemberDeploymentTable
            title="経路・月別会員登録展開率（Google人材紹介）"
            tableLabels={[
              { id: "deployment", label: "展開", minWidth: 120 },
            ].concat(
              memberDeploymentEveryMonthByGoogleAgent.map((row) => {
                return {
                  id: row.created_ym,
                  label:
                    row.created_ym.substring(0, 4) +
                    "/" +
                    row.created_ym.substring(4),
                  minWidth: 100,
                };
              })
            )}
            tableData={memberDeploymentEveryMonthByGoogleAgent}
            onlyMemberCount={true}
          />
        </Grid>

        <Grid xs={12} md={6} lg={6}>
          <DashboardGraphEveryYear
            title="経路・月別会員登録数"
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
              series: memberCountEveryYearRoot.map((row_every_year) => {
                return {
                  year: row_every_year.created_year,
                  data: row_every_year.member_count_every_root.map(
                    (row_every_root) => {
                      return {
                        name: row_every_root.register_root,
                        data: row_every_root.member_count,
                      };
                    }
                  ),
                };
              }),
            }}
          />
        </Grid>

        <Grid xs={12} md={6} lg={6}>
          <DashboardGraphEveryYear
            title="経路・月別応募者数"
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
              series: applicantCountEveryYearRoot.map((row_every_year) => {
                return {
                  year: row_every_year.created_year,
                  data: row_every_year.applicant_count_every_root.map(
                    (row_every_root) => {
                      return {
                        name: row_every_root.register_root,
                        data: row_every_root.applicant_count,
                      };
                    }
                  ),
                };
              }),
            }}
          />
        </Grid>

        <Grid xs={12}>
          <DashboardApplicantCountTableEveryCorporation
            title="法人別応募数"
            tableData={applicantCountEveryCorporation}
            tableLabels={[
              { id: "corporation_name", label: "法人" },
              { id: "prefecture_name", label: "都道府県" },
              { id: "office_count", label: "事業所数" },
              { id: "applicant_count", label: "応募数" },
              { id: "plan_name", label: "プラン" },
              { id: "start_date", label: "掲載開始日" },
              { id: "end_plan_date", label: "掲載終了日" },
              { id: "end_date", label: "掲載停止日" },
            ]}
          />
        </Grid>

        <Grid xs={12} md={6} lg={6}>
          <DashboardHorizontalBarGraph
            title="都道府県別の掲載中求人"
            chart={{
              series: jobCountEveryPrefecture.map((row) => {
                return { label: row.prefecture_name, value: row.job_count };
              }),
            }}
          />
        </Grid>

        <Grid xs={12} md={6} lg={6}>
          <DashboardHorizontalBarGraph
            title="ステータス別の求人件数"
            chart={{
              series: jobCountEveryStatus.map((row) => {
                return { label: row.status_name, value: row.job_count };
              }),
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
              series: applicantCountEveryYear.map((row) => {
                return {
                  name: `${row.created_year}年`,
                  data: row.applicant_count,
                };
              }),
            }}
          />
        </Grid>

        <Grid xs={12} md={6} lg={6}>
          <DashboardVerticalBarGraph
            title="月別問い合わせ数"
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
              series: inquiryCountEveryYear.map((row) => {
                return {
                  name: `${row.created_year}年`,
                  data: row.inquiry_count,
                };
              }),
            }}
          />
        </Grid>
      </Grid>
    </Container>
  );
}
