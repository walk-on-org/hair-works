"use client";

import { useCallback, useState } from "react";

import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import { alpha } from "@mui/material/styles";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";

import { paths } from "@/routes/paths";
import { RouterLink } from "@/routes/components";

import { useGetMailmagazineConfig } from "@/api/mailmagazine-config";

import Label from "@/components/label";
import CustomBreadcrumbs from "@/components/custom-breadcrumbs";
import Iconify from "@/components/iconify";
import EmptyContent from "@/components/empty-content";
import { useSettingsContext } from "@/components/settings";

import MailmagazineConfigDetailToolbar from "../mailmagazine-config-detail-toolbar";
import { MailmagazineConfigDetailSkeleton } from "../mailmagazine-config-skelton";

// ----------------------------------------------------------------------

type Props = {
  id: string;
};

export default function MailmagazineConfigDetailView({ id }: Props) {
  const {
    mailmagazineConfig,
    mailmagazineConfigLoading,
    mailmagazineConfigError,
  } = useGetMailmagazineConfig(id);
  const settings = useSettingsContext();
  const [currentTab, setCurrentTab] = useState("basic");
  const handleChangeTab = useCallback(
    (event: React.SyntheticEvent, newValue: string) => {
      setCurrentTab(newValue);
    },
    []
  );

  const renderSkeleton = <MailmagazineConfigDetailSkeleton />;

  const renderError = (
    <EmptyContent
      filled
      title={`${mailmagazineConfigError?.message}`}
      action={
        <Button
          component={RouterLink}
          href={paths.admin.mailmagazineConfig.root}
          startIcon={<Iconify icon="eva:arrow-ios-back-fill" width={16} />}
          sx={{ mt: 3 }}
        >
          一覧へ戻る
        </Button>
      }
      sx={{ py: 10 }}
    />
  );

  const renderMailmagazineConfig = mailmagazineConfig && (
    <>
      <CustomBreadcrumbs
        heading="メルマガ設定詳細"
        links={[
          { name: "ダッシュボード", href: paths.admin.dashboard },
          {
            name: "メルマガ設定",
            href: paths.admin.mailmagazineConfig.root,
          },
          { name: mailmagazineConfig?.title },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <MailmagazineConfigDetailToolbar
        backLink={paths.admin.mailmagazineConfig.root}
        editLink={paths.admin.mailmagazineConfig.edit(
          `${mailmagazineConfig?.id}`
        )}
        exportLink="TODO"
      />

      <Card>
        <Tabs
          value={currentTab}
          onChange={handleChangeTab}
          sx={{
            px: 3,
            boxShadow: (theme) =>
              `inset 0 -2px 0 0 ${alpha(theme.palette.grey[500], 0.08)}`,
          }}
        >
          {[
            {
              value: "basic",
              label: "基本設定",
            },
            {
              value: "member",
              label: "会員抽出条件",
            },
            {
              value: "job",
              label: "求人抽出条件",
            },
          ].map((tab) => (
            <Tab key={tab.value} value={tab.value} label={tab.label} />
          ))}
        </Tabs>

        {currentTab === "basic" && (
          <Stack spacing={3} sx={{ p: 3 }}>
            <Stack direction="row">
              <Typography variant="subtitle2" sx={{ width: 160 }}>
                タイトル
              </Typography>
              <Typography variant="body2" sx={{ flexGrow: 1 }}>
                {mailmagazineConfig.title}
              </Typography>
            </Stack>

            <Stack direction="row">
              <Typography variant="subtitle2" sx={{ width: 160 }}>
                送信求人種別
              </Typography>
              <Typography variant="body2" sx={{ flexGrow: 1 }}>
                {mailmagazineConfig.deliver_job_type_name}
              </Typography>
            </Stack>

            <Stack direction="row">
              <Typography variant="subtitle2" sx={{ width: 160 }}>
                距離（km）
              </Typography>
              <Typography variant="body2" sx={{ flexGrow: 1 }}>
                {mailmagazineConfig.job_match_distance}
              </Typography>
            </Stack>

            <Stack direction="row">
              <Typography variant="subtitle2" sx={{ width: 160 }}>
                メール内求人件数上限
              </Typography>
              <Typography variant="body2" sx={{ flexGrow: 1 }}>
                {mailmagazineConfig.job_count_limit}
              </Typography>
            </Stack>
          </Stack>
        )}

        {currentTab === "member" && (
          <Stack spacing={3} sx={{ p: 3 }}>
            <Stack direction="row">
              <Typography variant="subtitle2" sx={{ width: 160 }}>
                会員住所
              </Typography>
              <Typography variant="body2" sx={{ flexGrow: 1 }}>
                {mailmagazineConfig.mailmagazine_m_areas
                  .map((row) => {
                    return row.prefecture_name + row.city_name;
                  })
                  .join("、")}
              </Typography>
            </Stack>

            <Stack direction="row">
              <Typography variant="subtitle2" sx={{ width: 160 }}>
                希望職種
              </Typography>
              <Typography variant="body2" sx={{ flexGrow: 1 }}>
                {mailmagazineConfig.m_lp_job_category_names.join("、")}
              </Typography>
            </Stack>

            <Stack direction="row">
              <Typography variant="subtitle2" sx={{ width: 160 }}>
                希望勤務地
              </Typography>
              <Typography variant="body2" sx={{ flexGrow: 1 }}>
                {mailmagazineConfig.m_emp_prefecture_names.join("、")}
              </Typography>
            </Stack>

            <Stack direction="row">
              <Typography variant="subtitle2" sx={{ width: 160 }}>
                希望勤務体系
              </Typography>
              <Typography variant="body2" sx={{ flexGrow: 1 }}>
                {mailmagazineConfig.m_employment_names.join("、")}
              </Typography>
            </Stack>

            <Stack direction="row">
              <Typography variant="subtitle2" sx={{ width: 160 }}>
                保有資格
              </Typography>
              <Typography variant="body2" sx={{ flexGrow: 1 }}>
                {mailmagazineConfig.m_qualification_names.join("、")}
              </Typography>
            </Stack>

            <Stack direction="row">
              <Typography variant="subtitle2" sx={{ width: 160 }}>
                ステータス
              </Typography>
              <Typography variant="body2" sx={{ flexGrow: 1 }}>
                {mailmagazineConfig.m_status_names.join("、")}
              </Typography>
            </Stack>

            <Stack direction="row">
              <Typography variant="subtitle2" sx={{ width: 160 }}>
                希望転職時期
              </Typography>
              <Typography variant="body2" sx={{ flexGrow: 1 }}>
                {mailmagazineConfig.m_change_time_names.join("、")}
              </Typography>
            </Stack>

            <Stack direction="row">
              <Typography variant="subtitle2" sx={{ width: 160 }}>
                生まれ年
              </Typography>
              <Typography variant="body2" sx={{ flexGrow: 1 }}>
                {mailmagazineConfig.member_birthyear_from
                  ? `${mailmagazineConfig.member_birthyear_from}年`
                  : ""}
                {mailmagazineConfig.member_birthyear_from ||
                mailmagazineConfig.member_birthyear_to
                  ? "〜"
                  : ""}
                {mailmagazineConfig.member_birthyear_to
                  ? `${mailmagazineConfig.member_birthyear_to}年`
                  : ""}
              </Typography>
            </Stack>
          </Stack>
        )}

        {currentTab === "job" && (
          <Stack spacing={3} sx={{ p: 3 }}>
            <Stack direction="row">
              <Typography variant="subtitle2" sx={{ width: 160 }}>
                送信対象法人
              </Typography>
              <Typography variant="body2" sx={{ flexGrow: 1 }}>
                {mailmagazineConfig.j_corporation_names.join("、")}
              </Typography>
            </Stack>

            <Stack direction="row">
              <Typography variant="subtitle2" sx={{ width: 160 }}>
                求人検索キーワード
              </Typography>
              <Typography variant="body2" sx={{ flexGrow: 1 }}>
                {mailmagazineConfig.job_keyword}
              </Typography>
            </Stack>

            <Stack direction="row">
              <Typography variant="subtitle2" sx={{ width: 160 }}>
                求人職種
              </Typography>
              <Typography variant="body2" sx={{ flexGrow: 1 }}>
                {mailmagazineConfig.j_job_category_names.join("、")}
              </Typography>
            </Stack>

            <Stack direction="row">
              <Typography variant="subtitle2" sx={{ width: 160 }}>
                役職/役割が同じ求人のみ送信
              </Typography>
              <Label
                variant="soft"
                color={
                  (mailmagazineConfig.job_match_lp_job_category == "1" &&
                    "info") ||
                  "default"
                }
              >
                {mailmagazineConfig.job_match_lp_job_category_name}
              </Label>
            </Stack>

            <Stack direction="row">
              <Typography variant="subtitle2" sx={{ width: 160 }}>
                雇用形態が同じ求人のみ送信
              </Typography>
              <Label
                variant="soft"
                color={
                  (mailmagazineConfig.job_match_employment == "1" && "info") ||
                  "default"
                }
              >
                {mailmagazineConfig.job_match_employment_name}
              </Label>
            </Stack>

            <Stack direction="row">
              <Typography variant="subtitle2" sx={{ width: 160 }}>
                １つ目の求人以外は他企業求人から検索
              </Typography>
              <Label
                variant="soft"
                color={
                  (mailmagazineConfig.search_other_corporation == "1" &&
                    "info") ||
                  "default"
                }
              >
                {mailmagazineConfig.search_other_corporation_name}
              </Label>
            </Stack>
          </Stack>
        )}
      </Card>
    </>
  );

  return (
    <Container maxWidth={settings.themeStretch ? false : "lg"}>
      {mailmagazineConfigLoading && renderSkeleton}

      {mailmagazineConfigError && renderError}

      {mailmagazineConfig && renderMailmagazineConfig}
    </Container>
  );
}
