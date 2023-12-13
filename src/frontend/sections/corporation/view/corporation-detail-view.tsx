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

import { useGetCorporation } from "@/api/corporation";

import Label from "@/components/label";
import Image from "@/components/image";
import CustomBreadcrumbs from "@/components/custom-breadcrumbs";
import Iconify from "@/components/iconify";
import EmptyContent from "@/components/empty-content";
import Scrollbar from "@/components/scrollbar";
import { useSettingsContext } from "@/components/settings";

import { fDate } from "@/utils/format-time";

import CorporationDetailToolbar from "../corporation-detail-toolbar";
import { CorporationDetailSkeleton } from "../corporation-skelton";

// ----------------------------------------------------------------------

type Props = {
  id: string;
};

export default function CorporationDetailView({ id }: Props) {
  const { corporation, corporationLoading, corporationError } =
    useGetCorporation(id);

  const settings = useSettingsContext();

  const renderSkeleton = <CorporationDetailSkeleton />;

  const renderError = (
    <EmptyContent
      filled
      title={`${corporationError?.message}`}
      action={
        <Button
          component={RouterLink}
          href={paths.admin.corporation.root}
          startIcon={<Iconify icon="eva:arrow-ios-back-fill" width={16} />}
          sx={{ mt: 3 }}
        >
          一覧へ戻る
        </Button>
      }
      sx={{ py: 10 }}
    />
  );

  const renderCorporation = corporation && (
    <>
      <CustomBreadcrumbs
        heading="法人詳細"
        links={[
          { name: "ダッシュボード", href: paths.admin.dashboard },
          {
            name: "法人",
            href: paths.admin.corporation.root,
          },
          { name: corporation?.name },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <CorporationDetailToolbar
        backLink={paths.admin.corporation.root}
        editLink={paths.admin.corporation.edit(`${corporation?.id}`)}
      />

      <Card>
        <Stack spacing={3} sx={{ p: 3 }}>
          <Stack direction="row">
            <Typography variant="subtitle2" sx={{ width: 160 }}>
              法人ID
            </Typography>
            <Typography variant="body2" sx={{ flexGrow: 1 }}>
              {corporation.id}
            </Typography>
          </Stack>

          <Stack direction="row">
            <Typography variant="subtitle2" sx={{ width: 160 }}>
              法人名
            </Typography>
            <Typography variant="body2" sx={{ flexGrow: 1 }}>
              {corporation.name}
            </Typography>
          </Stack>

          <Stack direction="row">
            <Typography variant="subtitle2" sx={{ width: 160 }}>
              法人名非公開
            </Typography>
            <Label
              variant="soft"
              color={(corporation.name_private == "1" && "info") || "default"}
            >
              {corporation.name_private_name}
            </Label>
          </Stack>

          <Stack direction="row">
            <Typography variant="subtitle2" sx={{ width: 160 }}>
              郵便番号
            </Typography>
            <Typography variant="body2" sx={{ flexGrow: 1 }}>
              {corporation.postcode}
            </Typography>
          </Stack>

          <Stack direction="row">
            <Typography variant="subtitle2" sx={{ width: 160 }}>
              都道府県
            </Typography>
            <Typography variant="body2" sx={{ flexGrow: 1 }}>
              {corporation.prefecture_name}
            </Typography>
          </Stack>

          <Stack direction="row">
            <Typography variant="subtitle2" sx={{ width: 160 }}>
              市区町村
            </Typography>
            <Typography variant="body2" sx={{ flexGrow: 1 }}>
              {corporation.city_name}
            </Typography>
          </Stack>

          <Stack direction="row">
            <Typography variant="subtitle2" sx={{ width: 160 }}>
              住所
            </Typography>
            <Typography variant="body2" sx={{ flexGrow: 1 }}>
              {corporation.address}
            </Typography>
          </Stack>

          <Stack direction="row">
            <Typography variant="subtitle2" sx={{ width: 160 }}>
              電話番号
            </Typography>
            <Typography variant="body2" sx={{ flexGrow: 1 }}>
              {corporation.tel}
            </Typography>
          </Stack>

          <Stack direction="row">
            <Typography variant="subtitle2" sx={{ width: 160 }}>
              FAX番号
            </Typography>
            <Typography variant="body2" sx={{ flexGrow: 1 }}>
              {corporation.fax}
            </Typography>
          </Stack>

          <Stack direction="row">
            <Typography variant="subtitle2" sx={{ width: 160 }}>
              サロン数（店舗）
            </Typography>
            <Typography variant="body2" sx={{ flexGrow: 1 }}>
              {corporation.salon_num}
            </Typography>
          </Stack>

          <Stack direction="row">
            <Typography variant="subtitle2" sx={{ width: 160 }}>
              社員数（人）
            </Typography>
            <Typography variant="body2" sx={{ flexGrow: 1 }}>
              {corporation.employee_num}
            </Typography>
          </Stack>

          <Stack direction="row">
            <Typography variant="subtitle2" sx={{ width: 160 }}>
              年商
            </Typography>
            <Typography variant="body2" sx={{ flexGrow: 1 }}>
              {corporation.yearly_turnover}
            </Typography>
          </Stack>

          <Stack direction="row">
            <Typography variant="subtitle2" sx={{ width: 160 }}>
              スタッフ平均年齢
            </Typography>
            <Typography variant="body2" sx={{ flexGrow: 1 }}>
              {corporation.average_age}
            </Typography>
          </Stack>

          <Stack direction="row">
            <Typography variant="subtitle2" sx={{ width: 160 }}>
              主な薬剤メーカー
            </Typography>
            <Typography variant="body2" sx={{ flexGrow: 1 }}>
              {corporation.drug_maker}
            </Typography>
          </Stack>

          <Stack direction="row">
            <Typography variant="subtitle2" sx={{ width: 160 }}>
              会社ホームページ
            </Typography>
            <Typography variant="body2" sx={{ flexGrow: 1 }}>
              {corporation.homepage}
            </Typography>
          </Stack>

          <Stack direction="row">
            <Typography variant="subtitle2" sx={{ width: 160 }}>
              優先表示（PICKUPやおすすめなど）
            </Typography>
            <Label
              variant="soft"
              color={(corporation.higher_display == "1" && "info") || "default"}
            >
              {corporation.higher_display_name}
            </Label>
          </Stack>

          <Typography variant="subtitle2">契約プラン</Typography>
          <TableContainer sx={{ overflow: "unset" }}>
            <Scrollbar>
              <Table sx={{ minWidth: 960 }}>
                <TableHead>
                  <TableRow>
                    <TableCell>プラン</TableCell>

                    <TableCell>掲載開始日</TableCell>

                    <TableCell>掲載終了日</TableCell>

                    <TableCell>掲載停止日</TableCell>

                    <TableCell>満了</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {corporation.contracts.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell>{row.plan_name}</TableCell>

                      <TableCell>
                        {row.start_date && fDate(row.start_date, "yyyy/MM/dd")}
                      </TableCell>

                      <TableCell>
                        {row.end_plan_date &&
                          fDate(row.end_plan_date, "yyyy/MM/dd")}
                      </TableCell>

                      <TableCell>
                        {row.end_date && fDate(row.end_date, "yyyy/MM/dd")}
                      </TableCell>

                      <TableCell>{row.expire_name}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Scrollbar>
          </TableContainer>

          {/*<Typography variant="subtitle2">求人一括設定画像</Typography>
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
                  {corporation.corporation_images.map((row, index) => (
                    <TableRow key={index}>
                      <Image src={row.image} />

                      <TableCell>{row.alttext}</TableCell>

                      <TableCell>{row.sort}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Scrollbar>
          </TableContainer>

          <Typography variant="subtitle2">特徴</Typography>
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
                  {corporation.corporation_features.map((row, index) => (
                    <TableRow key={index}>
                      <Image src={row.image} />

                      <TableCell>{row.feature}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Scrollbar>
                  </TableContainer>*/}
        </Stack>
      </Card>
    </>
  );

  return (
    <Container maxWidth={settings.themeStretch ? false : "lg"}>
      {corporationLoading && renderSkeleton}

      {corporationError && renderError}

      {corporation && renderCorporation}
    </Container>
  );
}
