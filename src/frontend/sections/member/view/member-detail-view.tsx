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
import Link from "@mui/material/Link";

import { paths } from "@/routes/paths";
import { RouterLink } from "@/routes/components";

import { useGetMember } from "@/api/member";

import Label from "@/components/label";
import CustomBreadcrumbs from "@/components/custom-breadcrumbs";
import Iconify from "@/components/iconify";
import EmptyContent from "@/components/empty-content";
import Scrollbar from "@/components/scrollbar";
import { useSettingsContext } from "@/components/settings";

import MemberDetailToolbar from "../member-detail-toolbar";
import { MemberDetailSkeleton } from "../member-skelton";
import { fDateTime } from "@/utils/format-time";

// ----------------------------------------------------------------------

type Props = {
  id: string;
};

export default function MemberDetailView({ id }: Props) {
  const { member, memberLoading, memberError } = useGetMember(id);
  const settings = useSettingsContext();
  const [currentTab, setCurrentTab] = useState("applicant_history");
  const handleChangeTab = useCallback(
    (event: React.SyntheticEvent, newValue: string) => {
      setCurrentTab(newValue);
    },
    []
  );

  const renderSkeleton = <MemberDetailSkeleton />;

  const renderError = (
    <EmptyContent
      filled
      title={`${memberError?.message}`}
      action={
        <Button
          component={RouterLink}
          href={paths.admin.member.root}
          startIcon={<Iconify icon="eva:arrow-ios-back-fill" width={16} />}
          sx={{ mt: 3 }}
        >
          一覧へ戻る
        </Button>
      }
      sx={{ py: 10 }}
    />
  );

  const renderMember = member && (
    <>
      <CustomBreadcrumbs
        heading="会員情報詳細"
        links={[
          { name: "ダッシュボード", href: paths.admin.dashboard },
          {
            name: "会員情報",
            href: paths.admin.member.root,
          },
          { name: member?.name },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <MemberDetailToolbar
        backLink={paths.admin.member.root}
        editLink={paths.admin.member.edit(`${member?.id}`)}
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
              会員ID
            </Typography>
            <Typography variant="body2" sx={{ flexGrow: 1 }}>
              {member.id}
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
              氏名
            </Typography>
            <Typography variant="body2" sx={{ flexGrow: 1 }}>
              {member.name}
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
              {member.name_kana}
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
              {member.birthyear}
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
              {member.postcode}
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
              {member.prefecture_name}
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
              {member.address}
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
              {member.phone}
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
              {member.email}
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
              転職への気持ち
            </Typography>
            <Typography variant="body2" sx={{ flexGrow: 1 }}>
              {member.job_change_feeling_name}
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
              {member.change_time_name}
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
              {member.retirement_time_name}
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
              {member.employment_name}
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
              {member.emp_prefecture_name}
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
              {member.qualification_names.join("、")}
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
              {member.lp_job_category_names.join("、")}
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
              応募数
            </Typography>
            <Typography variant="body2" sx={{ flexGrow: 1 }}>
              {member.applicant_count}
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
              {member.status_name}
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
              連絡可能日時
            </Typography>
            <Typography
              variant="body2"
              sx={{ flexGrow: 1, whiteSpace: "pre-wrap" }}
            >
              {member.member_proposal_datetimes_text}
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
              登録サイト
            </Typography>
            <Typography variant="body2" sx={{ flexGrow: 1 }}>
              {member.register_site_name}
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
              登録フォーム
            </Typography>
            <Typography variant="body2" sx={{ flexGrow: 1 }}>
              {member.register_form_name}
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
              {member.register_root}
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
              登録経緯求人
            </Typography>
            {member.job_id && (
              <Link href={paths.admin.job.detail(member.job_id)}>
                {member.job_name}
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
              紹介者氏名（フォームでの入力値）
            </Typography>
            <Typography variant="body2" sx={{ flexGrow: 1 }}>
              {member.introduction_name}
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
              紹介者会員情報
            </Typography>
            {member.introduction_member_id && (
              <Link
                href={paths.admin.member.detail(member.introduction_member_id)}
              >
                {member.introduction_member_name}
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
              紹介プレゼントステータス
            </Typography>
            <Label variant="soft" color="default" width="fit-content">
              {member.introduction_gift_status_name}
            </Label>
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
              value: "applicant_history",
              label: "応募履歴",
            },
            {
              value: "duplication",
              label: "重複の会員情報（電話番号またはメールアドレスが一致）",
            },
            {
              value: "keep",
              label: "お気に入り一覧",
            },
            {
              value: "history",
              label: "閲覧履歴一覧",
            },
          ].map((tab) => (
            <Tab key={tab.value} value={tab.value} label={tab.label} />
          ))}
        </Tabs>

        {currentTab === "applicant_history" && (
          <TableContainer sx={{ overflow: "unset" }}>
            <Scrollbar>
              <Table sx={{ minWidth: 960 }}>
                <TableHead>
                  <TableRow>
                    <TableCell>応募日時</TableCell>

                    <TableCell>法人</TableCell>

                    <TableCell>事業所</TableCell>

                    <TableCell>求人</TableCell>

                    <TableCell>職種</TableCell>

                    <TableCell>役職/役割</TableCell>

                    <TableCell>雇用形態</TableCell>

                    <TableCell>申込種別</TableCell>

                    <TableCell>希望日時</TableCell>

                    <TableCell>応募経路</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {member.applicant_histories.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell>{fDateTime(row.created_at)}</TableCell>

                      <TableCell>{row.corporation_name}</TableCell>

                      <TableCell>{row.office_name}</TableCell>

                      <TableCell>{row.job_name}</TableCell>

                      <TableCell>{row.job_category_name}</TableCell>

                      <TableCell>{row.position_name}</TableCell>

                      <TableCell>{row.employment_name}</TableCell>

                      <TableCell>{row.proposal_type_name}</TableCell>

                      <TableCell sx={{ whiteSpace: "pre-wrap" }}>
                        {row.applicant_proposal_datetimes_text}
                      </TableCell>

                      <TableCell>{row.register_root}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Scrollbar>
          </TableContainer>
        )}

        {currentTab == "duplication" && (
          <TableContainer sx={{ overflow: "unset" }}>
            <Scrollbar>
              <Table sx={{ minWidth: 960 }}>
                <TableHead>
                  <TableRow>
                    <TableCell>登録日時</TableCell>

                    <TableCell>氏名</TableCell>

                    <TableCell>電話番号</TableCell>

                    <TableCell>メールアドレス</TableCell>

                    <TableCell>状態</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {member.duplicate_members.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell>{fDateTime(row.created_at)}</TableCell>

                      <TableCell>{row.name}</TableCell>

                      <TableCell>{row.phone}</TableCell>

                      <TableCell>{row.email}</TableCell>

                      <TableCell>{row.status_name}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Scrollbar>
          </TableContainer>
        )}

        {currentTab == "keep" && (
          <TableContainer sx={{ overflow: "unset" }}>
            <Scrollbar>
              <Table sx={{ minWidth: 960 }}>
                <TableHead>
                  <TableRow>
                    <TableCell>法人</TableCell>

                    <TableCell>事業所</TableCell>

                    <TableCell>求人ID</TableCell>

                    <TableCell>求人名</TableCell>

                    <TableCell>状態</TableCell>

                    <TableCell>お気に入り日時</TableCell>

                    <TableCell>お気に入り解除日時</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {member.keeps.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell>{row.corporation_name}</TableCell>

                      <TableCell>{row.office_name}</TableCell>

                      <TableCell>{row.job_id}</TableCell>

                      <TableCell>{row.job_name}</TableCell>

                      <TableCell>{row.status_name}</TableCell>

                      <TableCell>{fDateTime(row.keeped_at)}</TableCell>

                      <TableCell>{fDateTime(row.released_at)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Scrollbar>
          </TableContainer>
        )}

        {currentTab == "history" && (
          <TableContainer sx={{ overflow: "unset" }}>
            <Scrollbar>
              <Table sx={{ minWidth: 960 }}>
                <TableHead>
                  <TableRow>
                    <TableCell>法人</TableCell>

                    <TableCell>事業所</TableCell>

                    <TableCell>求人ID</TableCell>

                    <TableCell>求人名</TableCell>

                    <TableCell>閲覧日時</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {member.histories.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell>{row.corporation_name}</TableCell>

                      <TableCell>{row.office_name}</TableCell>

                      <TableCell>{row.job_id}</TableCell>

                      <TableCell>{row.job_name}</TableCell>

                      <TableCell>{fDateTime(row.viewed_at)}</TableCell>
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
      {memberLoading && renderSkeleton}

      {memberError && renderError}

      {member && renderMember}
    </Container>
  );
}
