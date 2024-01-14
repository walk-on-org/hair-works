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
import Table from "@mui/material/Table";
import TableRow from "@mui/material/TableRow";
import TableHead from "@mui/material/TableHead";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";

import { paths } from "@/routes/paths";
import { RouterLink } from "@/routes/components";

import { useGetApplicant } from "@/api/applicant";

import Label from "@/components/label";
import CustomBreadcrumbs from "@/components/custom-breadcrumbs";
import Iconify from "@/components/iconify";
import EmptyContent from "@/components/empty-content";
import Scrollbar from "@/components/scrollbar";
import { useSettingsContext } from "@/components/settings";

import ApplicantDetailToolbar from "../applicant-detail-toolbar";
import { ApplicantDetailSkeleton } from "../applicant-skelton";
import { Link } from "@mui/material";
import { fDate, fDateTime } from "@/utils/format-time";

// ----------------------------------------------------------------------

type Props = {
  id: string;
};

export default function ApplicantDetailView({ id }: Props) {
  const { applicant, applicantLoading, applicantError } = useGetApplicant(id);
  const settings = useSettingsContext();
  const [currentTab, setCurrentTab] = useState("contact_history");
  const handleChangeTab = useCallback(
    (event: React.SyntheticEvent, newValue: string) => {
      setCurrentTab(newValue);
    },
    []
  );

  const renderSkeleton = <ApplicantDetailSkeleton />;

  const renderError = (
    <EmptyContent
      filled
      title={`${applicantError?.message}`}
      action={
        <Button
          component={RouterLink}
          href={paths.admin.applicant.root}
          startIcon={<Iconify icon="eva:arrow-ios-back-fill" width={16} />}
          sx={{ mt: 3 }}
        >
          一覧へ戻る
        </Button>
      }
      sx={{ py: 10 }}
    />
  );

  const renderApplicant = applicant && (
    <>
      <CustomBreadcrumbs
        heading="応募者詳細"
        links={[
          { name: "ダッシュボード", href: paths.admin.dashboard },
          {
            name: "応募者",
            href: paths.admin.applicant.root,
          },
          { name: applicant?.name },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <ApplicantDetailToolbar
        backLink={paths.admin.applicant.root}
        editLink={paths.admin.applicant.edit(`${applicant?.id}`)}
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
              応募者ID
            </Typography>
            <Typography variant="body2" sx={{ flexGrow: 1 }}>
              {applicant.id}
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
              法人
            </Typography>
            <Typography variant="body2" sx={{ flexGrow: 1 }}>
              {applicant.corporation_name}
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
              事業所
            </Typography>
            <Typography variant="body2" sx={{ flexGrow: 1 }}>
              {applicant.office_name}
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
              事業所都道府県
            </Typography>
            <Typography variant="body2" sx={{ flexGrow: 1 }}>
              {applicant.office_prefecture_name}
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
              求人
            </Typography>
            {applicant.job_id && (
              <Link
                variant="subtitle2"
                href={paths.admin.job.detail(applicant.job_id)}
              >
                {applicant.job_name}
              </Link>
            )}
          </Stack>

          <Stack
            direction={{
              xs: "column",
              md: "row",
            }}
            rowGap={1}
          >
            <Typography variant="subtitle2" sx={{ width: 160 }}>
              求人種類
            </Typography>
            <Typography variant="body2" sx={{ flexGrow: 1 }}>
              {applicant.job_recommend_name}
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
              応募日時
            </Typography>
            <Typography variant="body2" sx={{ flexGrow: 1 }}>
              {fDateTime(applicant.created_at)}
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
            <Label variant="soft" color="default" width="fit-content">
              {applicant.status_name}
            </Label>
          </Stack>

          <Stack
            direction={{
              xs: "column",
              md: "row",
            }}
            rowGap={1}
          >
            <Typography variant="subtitle2" sx={{ width: 160 }}>
              申込種別
            </Typography>
            <Typography variant="body2" sx={{ flexGrow: 1 }}>
              {applicant.proposal_type_name}
            </Typography>
          </Stack>

          {(applicant.proposal_type == "1" ||
            applicant.proposal_type == "2") && (
            <Stack
              direction={{
                xs: "column",
                md: "row",
              }}
              rowGap={1}
            >
              <Typography variant="subtitle2" sx={{ width: 160 }}>
                {applicant.proposal_type == "1"
                  ? "面接可能日時"
                  : "見学希望日時"}
              </Typography>
              <Typography
                variant="body2"
                sx={{ flexGrow: 1, whiteSpace: "pre-wrap" }}
              >
                {applicant.applicant_proposal_datetimes_text}
              </Typography>
            </Stack>
          )}

          <Stack
            direction={{
              xs: "column",
              md: "row",
            }}
            rowGap={1}
          >
            <Typography variant="subtitle2" sx={{ width: 160 }}>
              氏名
            </Typography>
            <Typography variant="body2" sx={{ flexGrow: 1 }}>
              {applicant.name}
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
              カナ名
            </Typography>
            <Typography variant="body2" sx={{ flexGrow: 1 }}>
              {applicant.name_kana}
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
              生まれ年
            </Typography>
            <Typography variant="body2" sx={{ flexGrow: 1 }}>
              {applicant.birthyear}
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
              郵便番号
            </Typography>
            <Typography variant="body2" sx={{ flexGrow: 1 }}>
              {applicant.postcode}
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
              都道府県
            </Typography>
            <Typography variant="body2" sx={{ flexGrow: 1 }}>
              {applicant.prefecture_name}
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
              住所
            </Typography>
            <Typography variant="body2" sx={{ flexGrow: 1 }}>
              {applicant.address}
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
              電話番号
            </Typography>
            <Typography variant="body2" sx={{ flexGrow: 1 }}>
              {applicant.phone}
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
              メールアドレス
            </Typography>
            <Typography variant="body2" sx={{ flexGrow: 1 }}>
              {applicant.mail}
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
              希望転職時期
            </Typography>
            <Typography variant="body2" sx={{ flexGrow: 1 }}>
              {applicant.change_time_name}
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
              退職意向
            </Typography>
            <Typography variant="body2" sx={{ flexGrow: 1 }}>
              {applicant.retirement_time_name}
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
              希望勤務体系
            </Typography>
            <Typography variant="body2" sx={{ flexGrow: 1 }}>
              {applicant.employment_name}
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
              希望勤務地
            </Typography>
            <Typography variant="body2" sx={{ flexGrow: 1 }}>
              {applicant.emp_prefecture_name}
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
              保有資格
            </Typography>
            <Typography variant="body2" sx={{ flexGrow: 1 }}>
              {applicant.qualification_names.join("、")}
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
              希望職種
            </Typography>
            <Typography variant="body2" sx={{ flexGrow: 1 }}>
              {applicant.lp_job_category_names.join("、")}
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
              備考
            </Typography>
            <Typography
              variant="body2"
              sx={{ flexGrow: 1, whiteSpace: "pre-wrap" }}
            >
              {applicant.note}
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
              登録経路
            </Typography>
            <Typography variant="body2" sx={{ flexGrow: 1 }}>
              {applicant.register_root}
            </Typography>
          </Stack>
        </Stack>
      </Card>

      <Card sx={{ my: 4 }}>
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
              value: "contact_history",
              label: "コンタクト履歴",
            },
          ].map((tab) => (
            <Tab key={tab.value} value={tab.value} label={tab.label} />
          ))}
        </Tabs>

        {currentTab === "contact_history" && (
          <TableContainer sx={{ overflow: "unset" }}>
            <Scrollbar>
              <Table sx={{ minWidth: 960 }}>
                <TableHead>
                  <TableRow>
                    <TableCell>コンタクト日</TableCell>

                    <TableCell>メモ</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {applicant.applicant_contact_histories.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell>{fDate(row.contact_date)}</TableCell>

                      <TableCell sx={{ whiteSpace: "pre-wrap" }}>
                        {row.contact_memo}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Scrollbar>
          </TableContainer>
        )}
      </Card>
    </>
  );

  return (
    <Container maxWidth={settings.themeStretch ? false : "lg"}>
      {applicantLoading && renderSkeleton}

      {applicantError && renderError}

      {applicant && renderApplicant}
    </Container>
  );
}
