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

import { useGetJob } from "@/api/job";

import Image from "@/components/image";
import Label from "@/components/label";
import CustomBreadcrumbs from "@/components/custom-breadcrumbs";
import Iconify from "@/components/iconify";
import EmptyContent from "@/components/empty-content";
import Scrollbar from "@/components/scrollbar";
import { useSettingsContext } from "@/components/settings";

import JobDetailToolbar from "../job-detail-toolbar";
import { JobDetailSkeleton } from "../job-skelton";
import { Link } from "@mui/material";
import { fCurrency } from "@/utils/format-number";

// ----------------------------------------------------------------------

type Props = {
  id: string;
};

export default function JobDetailView({ id }: Props) {
  const { job, jobLoading, jobError } = useGetJob(id);
  const settings = useSettingsContext();
  const [currentTab, setCurrentTab] = useState("image");
  const handleChangeTab = useCallback(
    (event: React.SyntheticEvent, newValue: string) => {
      setCurrentTab(newValue);
    },
    []
  );

  const renderSkeleton = <JobDetailSkeleton />;

  const renderError = (
    <EmptyContent
      filled
      title={`${jobError?.message}`}
      action={
        <Button
          component={RouterLink}
          href={paths.admin.job.root}
          startIcon={<Iconify icon="eva:arrow-ios-back-fill" width={16} />}
          sx={{ mt: 3 }}
        >
          一覧へ戻る
        </Button>
      }
      sx={{ py: 10 }}
    />
  );

  const renderJob = job && (
    <>
      <CustomBreadcrumbs
        heading="求人詳細"
        links={[
          { name: "ダッシュボード", href: paths.admin.dashboard },
          {
            name: "求人",
            href: paths.admin.job.root,
          },
          { name: job?.name },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <JobDetailToolbar
        backLink={paths.admin.job.root}
        editLink={paths.admin.job.edit(`${job?.id}`)}
        previewLink="TODO"
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
              求人ID
            </Typography>
            <Typography variant="body2" sx={{ flexGrow: 1 }}>
              {job.id}
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
              求人名
            </Typography>
            <Typography variant="body2" sx={{ flexGrow: 1 }}>
              {job.name}
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
            <Link
              variant="subtitle2"
              sx={{ cursor: "pointer" }}
              href={paths.admin.office.detail(job.office_id)}
            >
              {job.office_name}
            </Link>
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
              color={
                (job.status == "10" && "info") ||
                (job.status == "20" && "warning") ||
                "default"
              }
              width="fit-content"
            >
              {job.status_name}
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
              PickUp求人
            </Typography>
            <Label
              variant="soft"
              color={(job.pickup == "1" && "info") || "default"}
              width="fit-content"
            >
              {job.pickup_name}
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
              非公開求人
            </Typography>
            <Label
              variant="soft"
              color={(job.private == "1" && "info") || "default"}
              width="fit-content"
            >
              {job.private_name}
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
              オススメ求人
            </Typography>
            <Label
              variant="soft"
              color={(job.recommend == "1" && "info") || "default"}
              width="fit-content"
            >
              {job.recommend_name}
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
              Indeed非公開
            </Typography>
            <Label
              variant="soft"
              color={(job.indeed_private == "1" && "info") || "default"}
              width="fit-content"
            >
              {job.indeed_private_name}
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
              最低賃金を今後チェックしない
            </Typography>
            <Label
              variant="soft"
              color={(job.minimum_wage_ok == "1" && "info") || "default"}
              width="fit-content"
            >
              {job.minimum_wage_ok_name}
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
              職種
            </Typography>
            <Typography variant="body2" sx={{ flexGrow: 1 }}>
              {job.job_category_name}
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
              役職/役割
            </Typography>
            <Typography variant="body2" sx={{ flexGrow: 1 }}>
              {job.position_name}
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
              雇用形態
            </Typography>
            <Typography variant="body2" sx={{ flexGrow: 1 }}>
              {job.employment_name}
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
              月給
            </Typography>
            <Typography variant="body2" sx={{ flexGrow: 1 }}>
              {job.m_salary_lower ? `${fCurrency(job.m_salary_lower)}円` : ""}
              {job.m_salary_lower || job.m_salary_upper ? "〜" : ""}
              {job.m_salary_upper ? `${fCurrency(job.m_salary_upper)}円` : ""}
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
              時給
            </Typography>
            <Typography variant="body2" sx={{ flexGrow: 1 }}>
              {job.t_salary_lower ? `${fCurrency(job.t_salary_lower)}円` : ""}
              {job.t_salary_lower || job.t_salary_upper ? "〜" : ""}
              {job.t_salary_upper ? `${fCurrency(job.t_salary_upper)}円` : ""}
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
              日給
            </Typography>
            <Typography variant="body2" sx={{ flexGrow: 1 }}>
              {job.d_salary_lower ? `${fCurrency(job.d_salary_lower)}円` : ""}
              {job.d_salary_lower || job.d_salary_upper ? "〜" : ""}
              {job.d_salary_upper ? `${fCurrency(job.d_salary_upper)}円` : ""}
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
              歩合
            </Typography>
            <Typography variant="body2" sx={{ flexGrow: 1 }}>
              {job.commission_lower
                ? `${fCurrency(job.commission_lower)}%`
                : ""}
              {job.commission_lower || job.commission_upper ? "〜" : ""}
              {job.commission_upper
                ? `${fCurrency(job.commission_upper)}%`
                : ""}
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
              給与
            </Typography>
            <Typography
              variant="body2"
              sx={{ flexGrow: 1, whiteSpace: "pre-wrap" }}
            >
              {job.salary}
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
              勤務時間
            </Typography>
            <Typography
              variant="body2"
              sx={{ flexGrow: 1, whiteSpace: "pre-wrap" }}
            >
              {job.work_time}
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
              仕事内容
            </Typography>
            <Typography
              variant="body2"
              sx={{ flexGrow: 1, whiteSpace: "pre-wrap" }}
            >
              {job.job_description}
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
              休日
            </Typography>
            <Typography variant="body2" sx={{ flexGrow: 1 }}>
              {job.holiday_names.join("、")}
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
              休日メモ
            </Typography>
            <Typography
              variant="body2"
              sx={{ flexGrow: 1, whiteSpace: "pre-wrap" }}
            >
              {job.holiday}
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
              福利厚生・手当て
            </Typography>
            <Typography
              variant="body2"
              sx={{ flexGrow: 1, whiteSpace: "pre-wrap" }}
            >
              {job.welfare}
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
              必須免許
            </Typography>
            <Typography variant="body2" sx={{ flexGrow: 1 }}>
              {job.qualification_names.join("、")}
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
              必須免許・資格メモ
            </Typography>
            <Typography
              variant="body2"
              sx={{ flexGrow: 1, whiteSpace: "pre-wrap" }}
            >
              {job.entry_requirement}
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
              キャッチコピー
            </Typography>
            <Typography
              variant="body2"
              sx={{ flexGrow: 1, whiteSpace: "pre-wrap" }}
            >
              {job.catch_copy}
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
              おすすめポイント
            </Typography>
            <Typography
              variant="body2"
              sx={{ flexGrow: 1, whiteSpace: "pre-wrap" }}
            >
              {job.recommend_point}
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
              サロンからのメッセージ
            </Typography>
            <Typography
              variant="body2"
              sx={{ flexGrow: 1, whiteSpace: "pre-wrap" }}
            >
              {job.salon_message}
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
              求人こだわり条件
            </Typography>
            <Typography variant="body2" sx={{ flexGrow: 1 }}>
              {job.commitment_term_names.join("、")}
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
              value: "image",
              label: "求人画像",
            },
          ].map((tab) => (
            <Tab key={tab.value} value={tab.value} label={tab.label} />
          ))}
        </Tabs>

        {currentTab === "image" && (
          <TableContainer sx={{ overflow: "unset" }}>
            <Scrollbar>
              <Table sx={{ minWidth: 960 }}>
                <TableHead>
                  <TableRow>
                    <TableCell>画像</TableCell>

                    <TableCell>画像説明</TableCell>

                    <TableCell>ソート順</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {job.job_images.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Image width={200} src={row.image} />
                      </TableCell>

                      <TableCell>{row.alttext}</TableCell>

                      <TableCell>{row.sort}</TableCell>
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
      {jobLoading && renderSkeleton}

      {jobError && renderError}

      {job && renderJob}
    </Container>
  );
}
