"use client";

import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";

import { paths } from "@/routes/paths";
import { RouterLink } from "@/routes/components";

import { useGetPrefecture } from "@/api/prefecture";

import CustomBreadcrumbs from "@/components/custom-breadcrumbs";
import Iconify from "@/components/iconify";
import EmptyContent from "@/components/empty-content";
import { useSettingsContext } from "@/components/settings";

import { fCurrency } from "@/utils/format-number";

import PrefectureDetailToolbar from "../prefecture-detail-toolbar";
import { PrefectureDetailSkeleton } from "../prefecture-skelton";

// ----------------------------------------------------------------------

type Props = {
  id: string;
};

export default function PrefectureDetailView({ id }: Props) {
  const { prefecture, prefectureLoading, prefectureError } =
    useGetPrefecture(id);

  const settings = useSettingsContext();

  const renderSkeleton = <PrefectureDetailSkeleton />;

  const renderError = (
    <EmptyContent
      filled
      title={`${prefectureError?.message}`}
      action={
        <Button
          component={RouterLink}
          href={paths.admin.prefecture.root}
          startIcon={<Iconify icon="eva:arrow-ios-back-fill" width={16} />}
          sx={{ mt: 3 }}
        >
          一覧へ戻る
        </Button>
      }
      sx={{ py: 10 }}
    />
  );

  const renderPrefecture = prefecture && (
    <>
      <CustomBreadcrumbs
        heading="都道府県マスタ詳細"
        links={[
          { name: "ダッシュボード", href: paths.admin.dashboard },
          {
            name: "都道府県マスタ",
            href: paths.admin.prefecture.root,
          },
          { name: prefecture?.name },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <PrefectureDetailToolbar
        backLink={paths.admin.prefecture.root}
        editLink={paths.admin.prefecture.edit(`${prefecture?.id}`)}
      />

      <Card>
        <Stack spacing={3} sx={{ p: 3 }}>
          <Stack direction="row">
            <Typography variant="subtitle2" sx={{ width: 160 }}>
              都道府県名
            </Typography>
            <Typography variant="body2" sx={{ flexGrow: 1 }}>
              {prefecture.name}
            </Typography>
          </Stack>

          <Stack direction="row">
            <Typography variant="subtitle2" sx={{ width: 160 }}>
              都道府県カナ名
            </Typography>
            <Typography variant="body2" sx={{ flexGrow: 1 }}>
              {prefecture.name_kana}
            </Typography>
          </Stack>

          <Stack direction="row">
            <Typography variant="subtitle2" sx={{ width: 160 }}>
              パーマリンク
            </Typography>
            <Typography variant="body2" sx={{ flexGrow: 1 }}>
              {prefecture.permalink}
            </Typography>
          </Stack>

          <Stack direction="row">
            <Typography variant="subtitle2" sx={{ width: 160 }}>
              最低賃金
            </Typography>
            <Typography variant="body2" sx={{ flexGrow: 1 }}>
              {fCurrency(prefecture.minimum_wage)}
            </Typography>
          </Stack>

          <Stack direction="row">
            <Typography variant="subtitle2" sx={{ width: 160 }}>
              地方
            </Typography>
            <Typography variant="body2" sx={{ flexGrow: 1 }}>
              {prefecture.region_name}
            </Typography>
          </Stack>
        </Stack>
      </Card>
    </>
  );

  return (
    <Container maxWidth={settings.themeStretch ? false : "lg"}>
      {prefectureLoading && renderSkeleton}

      {prefectureError && renderError}

      {prefecture && renderPrefecture}
    </Container>
  );
}
