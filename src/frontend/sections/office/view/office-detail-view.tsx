"use client";

import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
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

import { useGetOffice } from "@/api/office";

import Label from "@/components/label";
import Image from "@/components/image";
import CustomBreadcrumbs from "@/components/custom-breadcrumbs";
import Iconify from "@/components/iconify";
import EmptyContent from "@/components/empty-content";
import Scrollbar from "@/components/scrollbar";
import { useSettingsContext } from "@/components/settings";

import { fDate } from "@/utils/format-time";

import OfficeDetailToolbar from "../office-detail-toolbar";
import { OfficeDetailSkeleton } from "../office-skelton";
import { Link } from "@mui/material";

// ----------------------------------------------------------------------

type Props = {
  id: string;
};

export default function OfficeDetailView({ id }: Props) {
  const { office, officeLoading, officeError } = useGetOffice(id);

  const settings = useSettingsContext();

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
        <Stack spacing={3} sx={{ p: 3 }}>
          <Stack direction="row">
            <Typography variant="subtitle2" sx={{ width: 160 }}>
              事業所ID
            </Typography>
            <Typography variant="body2" sx={{ flexGrow: 1 }}>
              {office.id}
            </Typography>
          </Stack>

          <Stack direction="row">
            <Typography variant="subtitle2" sx={{ width: 160 }}>
              事業所名
            </Typography>
            <Typography variant="body2" sx={{ flexGrow: 1 }}>
              {office.name}
            </Typography>
          </Stack>

          <Stack direction="row">
            <Typography variant="subtitle2" sx={{ width: 160 }}>
              法人
            </Typography>
            <Link href={paths.admin.corporation.detail(office.corporation_id)}>
              {office.corporation_name}
            </Link>
          </Stack>

          <Stack direction="row">
            <Typography variant="subtitle2" sx={{ width: 160 }}>
              郵便番号
            </Typography>
            <Typography variant="body2" sx={{ flexGrow: 1 }}>
              {office.postcode}
            </Typography>
          </Stack>

          <Stack direction="row">
            <Typography variant="subtitle2" sx={{ width: 160 }}>
              都道府県
            </Typography>
            <Typography variant="body2" sx={{ flexGrow: 1 }}>
              {office.prefecture_name}
            </Typography>
          </Stack>

          <Stack direction="row">
            <Typography variant="subtitle2" sx={{ width: 160 }}>
              市区町村
            </Typography>
            <Typography variant="body2" sx={{ flexGrow: 1 }}>
              {office.city_name}
            </Typography>
          </Stack>

          <Stack direction="row">
            <Typography variant="subtitle2" sx={{ width: 160 }}>
              住所
            </Typography>
            <Typography variant="body2" sx={{ flexGrow: 1 }}>
              {office.address}
            </Typography>
          </Stack>

          <Stack direction="row">
            <Typography variant="subtitle2" sx={{ width: 160 }}>
              電話番号
            </Typography>
            <Typography variant="body2" sx={{ flexGrow: 1 }}>
              {office.tel}
            </Typography>
          </Stack>

          <Stack direction="row">
            <Typography variant="subtitle2" sx={{ width: 160 }}>
              FAX番号
            </Typography>
            <Typography variant="body2" sx={{ flexGrow: 1 }}>
              {office.fax}
            </Typography>
          </Stack>

          <Stack direction="row">
            <Typography variant="subtitle2" sx={{ width: 160 }}>
              開店・リニューアル日
            </Typography>
            <Typography variant="body2" sx={{ flexGrow: 1 }}>
              {fDate(office.open_date, "yyyy/MM/dd")}
            </Typography>
          </Stack>

          <Stack direction="row">
            <Typography variant="subtitle2" sx={{ width: 160 }}>
              営業時間
            </Typography>
            <Typography variant="body2" sx={{ flexGrow: 1 }}>
              {office.business_time}
            </Typography>
          </Stack>

          <Stack direction="row">
            <Typography variant="subtitle2" sx={{ width: 160 }}>
              定休日
            </Typography>
            <Typography variant="body2" sx={{ flexGrow: 1 }}>
              {office.regular_holiday}
            </Typography>
          </Stack>

          <Stack direction="row">
            <Typography variant="subtitle2" sx={{ width: 160 }}>
              坪数
            </Typography>
            <Typography variant="body2" sx={{ flexGrow: 1 }}>
              {office.floor_space}
            </Typography>
          </Stack>

          <Stack direction="row">
            <Typography variant="subtitle2" sx={{ width: 160 }}>
              セット面
            </Typography>
            <Typography variant="body2" sx={{ flexGrow: 1 }}>
              {office.seat_num}
            </Typography>
          </Stack>

          <Stack direction="row">
            <Typography variant="subtitle2" sx={{ width: 160 }}>
              シャンプー台
            </Typography>
            <Typography variant="body2" sx={{ flexGrow: 1 }}>
              {office.shampoo_stand}
            </Typography>
          </Stack>

          <Stack direction="row">
            <Typography variant="subtitle2" sx={{ width: 160 }}>
              スタッフ
            </Typography>
            <Typography variant="body2" sx={{ flexGrow: 1 }}>
              {office.staff}
            </Typography>
          </Stack>

          <Stack direction="row">
            <Typography variant="subtitle2" sx={{ width: 160 }}>
              新規客割合
            </Typography>
            <Typography variant="body2" sx={{ flexGrow: 1 }}>
              {office.new_customer_ratio}
            </Typography>
          </Stack>

          <Stack direction="row">
            <Typography variant="subtitle2" sx={{ width: 160 }}>
              標準カット単価
            </Typography>
            <Typography variant="body2" sx={{ flexGrow: 1 }}>
              {office.cut_unit_price}
            </Typography>
          </Stack>

          <Stack direction="row">
            <Typography variant="subtitle2" sx={{ width: 160 }}>
              顧客単価
            </Typography>
            <Typography variant="body2" sx={{ flexGrow: 1 }}>
              {office.customer_unit_price}
            </Typography>
          </Stack>

          <Stack direction="row">
            <Typography variant="subtitle2" sx={{ width: 160 }}>
              受動喫煙対策
            </Typography>
            <Typography variant="body2" sx={{ flexGrow: 1 }}>
              {office.passive_smoking_name}
            </Typography>
          </Stack>

          <Stack direction="row">
            <Typography variant="subtitle2" sx={{ width: 160 }}>
              サロンURL
            </Typography>
            <Typography variant="body2" sx={{ flexGrow: 1 }}>
              {office.external_url}
            </Typography>
          </Stack>

          <Stack direction="row">
            <Typography variant="subtitle2" sx={{ width: 160 }}>
              SNSリンク
            </Typography>
            <Typography variant="body2" sx={{ flexGrow: 1 }}>
              {office.sns_url}
            </Typography>
          </Stack>
        </Stack>
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
