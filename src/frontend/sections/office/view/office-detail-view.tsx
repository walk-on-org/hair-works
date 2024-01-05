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

import { useGetOffice } from "@/api/office";

import Image from "@/components/image";
import CustomBreadcrumbs from "@/components/custom-breadcrumbs";
import Iconify from "@/components/iconify";
import EmptyContent from "@/components/empty-content";
import Scrollbar from "@/components/scrollbar";
import { useSettingsContext } from "@/components/settings";

import { fDate } from "@/utils/format-time";

import OfficeDetailToolbar from "../office-detail-toolbar";
import { OfficeDetailSkeleton } from "../office-skelton";

// ----------------------------------------------------------------------

type Props = {
  id: string;
};

export default function OfficeDetailView({ id }: Props) {
  const { office, officeLoading, officeError } = useGetOffice(id);
  const settings = useSettingsContext();
  const [currentTab, setCurrentTab] = useState("access");
  const handleChangeTab = useCallback(
    (event: React.SyntheticEvent, newValue: string) => {
      setCurrentTab(newValue);
    },
    []
  );

  const renderSkeleton = <OfficeDetailSkeleton />;

  const renderError = (
    <EmptyContent
      filled
      title={`${officeError?.message}`}
      action={
        <Button
          component={RouterLink}
          href={paths.admin.office.root}
          startIcon={<Iconify icon="eva:arrow-ios-back-fill" width={16} />}
          sx={{ mt: 3 }}
        >
          一覧へ戻る
        </Button>
      }
      sx={{ py: 10 }}
    />
  );

  const clienteleName = office?.office_clienteles.map((row) => {
    return row.clientele == "99" ? row.othertext : row.clientele_name;
  });

  const renderOffice = office && (
    <>
      <CustomBreadcrumbs
        heading="事業所詳細"
        links={[
          { name: "ダッシュボード", href: paths.admin.dashboard },
          {
            name: "事業所",
            href: paths.admin.office.root,
          },
          { name: office?.name },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <OfficeDetailToolbar
        backLink={paths.admin.office.root}
        editLink={paths.admin.office.edit(`${office?.id}`)}
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
              事業所ID
            </Typography>
            <Typography variant="body2" sx={{ flexGrow: 1 }}>
              {office.id}
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
              事業所名
            </Typography>
            <Typography variant="body2" sx={{ flexGrow: 1 }}>
              {office.name}
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
            <Link
              variant="subtitle2"
              sx={{ cursor: "pointer" }}
              href={paths.admin.corporation.detail(office.corporation_id)}
            >
              {office.corporation_name}
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
              郵便番号
            </Typography>
            <Typography variant="body2" sx={{ flexGrow: 1 }}>
              {office.postcode}
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
              {office.prefecture_name}
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
              市区町村
            </Typography>
            <Typography variant="body2" sx={{ flexGrow: 1 }}>
              {office.city_name}
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
              {office.address}
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
              {office.tel}
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
              FAX番号
            </Typography>
            <Typography variant="body2" sx={{ flexGrow: 1 }}>
              {office.fax}
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
              開店・リニューアル日
            </Typography>
            <Typography variant="body2" sx={{ flexGrow: 1 }}>
              {fDate(office.open_date, "yyyy/MM/dd")}
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
              営業時間
            </Typography>
            <Typography variant="body2" sx={{ flexGrow: 1 }}>
              {office.business_time}
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
              定休日
            </Typography>
            <Typography variant="body2" sx={{ flexGrow: 1 }}>
              {office.regular_holiday}
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
              坪数
            </Typography>
            <Typography variant="body2" sx={{ flexGrow: 1 }}>
              {office.floor_space}
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
              セット面
            </Typography>
            <Typography variant="body2" sx={{ flexGrow: 1 }}>
              {office.seat_num}
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
              シャンプー台
            </Typography>
            <Typography variant="body2" sx={{ flexGrow: 1 }}>
              {office.shampoo_stand}
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
              スタッフ
            </Typography>
            <Typography variant="body2" sx={{ flexGrow: 1 }}>
              {office.staff}
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
              新規客割合
            </Typography>
            <Typography variant="body2" sx={{ flexGrow: 1 }}>
              {office.new_customer_ratio}
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
              標準カット単価
            </Typography>
            <Typography variant="body2" sx={{ flexGrow: 1 }}>
              {office.cut_unit_price}
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
              顧客単価
            </Typography>
            <Typography variant="body2" sx={{ flexGrow: 1 }}>
              {office.customer_unit_price}
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
              受動喫煙対策
            </Typography>
            <Typography variant="body2" sx={{ flexGrow: 1 }}>
              {office.passive_smoking_name}
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
              客層
            </Typography>
            <Typography variant="body2" sx={{ flexGrow: 1 }}>
              {clienteleName.join("、")}
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
              サロンURL
            </Typography>
            <Typography variant="body2" sx={{ flexGrow: 1 }}>
              {office.external_url}
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
              SNSリンク
            </Typography>
            <Typography variant="body2" sx={{ flexGrow: 1 }}>
              {office.sns_url}
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
              value: "access",
              label: "事業所アクセス",
            },
            {
              value: "image",
              label: "求人一括設定画像",
            },
            {
              value: "feature",
              label: "特徴",
            },
            {
              value: "job",
              label: "求人一覧",
            },
          ].map((tab) => (
            <Tab key={tab.value} value={tab.value} label={tab.label} />
          ))}
        </Tabs>

        {currentTab === "access" && (
          <TableContainer sx={{ overflow: "unset" }}>
            <Scrollbar>
              <Table sx={{ minWidth: 960 }}>
                <TableHead>
                  <TableRow>
                    <TableCell>路線</TableCell>

                    <TableCell>駅</TableCell>

                    <TableCell>移動手段</TableCell>

                    <TableCell>移動時間（分）</TableCell>

                    <TableCell>備考</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {office.office_accesses.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell>{row.line_name}</TableCell>

                      <TableCell>{row.station_name}</TableCell>

                      <TableCell>{row.move_type_name}</TableCell>

                      <TableCell>{row.time}</TableCell>

                      <TableCell>{row.note}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Scrollbar>
          </TableContainer>
        )}

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
                  {office.office_images.map((row, index) => (
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

        {currentTab === "feature" && (
          <TableContainer sx={{ overflow: "unset" }}>
            <Scrollbar>
              <Table sx={{ minWidth: 960 }}>
                <TableHead>
                  <TableRow>
                    <TableCell>画像</TableCell>

                    <TableCell>特徴</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {office.office_features.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Image width={200} src={row.image} />
                      </TableCell>

                      <TableCell>{row.feature}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Scrollbar>
          </TableContainer>
        )}

        {currentTab === "job" && (
          <TableContainer sx={{ overflow: "unset" }}>
            <Scrollbar>
              <Table sx={{ minWidth: 960 }}>
                <TableHead>
                  <TableRow>
                    <TableCell>求人ID</TableCell>

                    <TableCell>求人名</TableCell>

                    <TableCell>職種</TableCell>

                    <TableCell>役職/役割</TableCell>

                    <TableCell>雇用形態</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {office.jobs.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell>{row.id}</TableCell>

                      <TableCell>{row.name}</TableCell>

                      <TableCell>{row.job_category_name}</TableCell>

                      <TableCell>{row.position_name}</TableCell>

                      <TableCell>{row.employment_name}</TableCell>
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
      {officeLoading && renderSkeleton}

      {officeError && renderError}

      {office && renderOffice}
    </Container>
  );
}
