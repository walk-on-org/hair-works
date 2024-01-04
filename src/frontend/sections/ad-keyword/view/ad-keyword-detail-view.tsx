"use client";

import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";

import { paths } from "@/routes/paths";
import { RouterLink } from "@/routes/components";

import { useGetAdKeyword } from "@/api/ad-keyword";

import Label from "@/components/label";
import CustomBreadcrumbs from "@/components/custom-breadcrumbs";
import Iconify from "@/components/iconify";
import EmptyContent from "@/components/empty-content";
import { useSettingsContext } from "@/components/settings";

import AdKeywordDetailToolbar from "../ad-keyword-detail-toolbar";
import { AdKeywordDetailSkeleton } from "../ad-keyword-skelton";

// ----------------------------------------------------------------------

type Props = {
  id: string;
};

export default function AdKeywordDetailView({ id }: Props) {
  const { adKeyword, adKeywordLoading, adKeywordError } = useGetAdKeyword(id);

  const settings = useSettingsContext();

  const renderSkeleton = <AdKeywordDetailSkeleton />;

  const renderError = (
    <EmptyContent
      filled
      title={`${adKeywordError?.message}`}
      action={
        <Button
          component={RouterLink}
          href={paths.admin.position.root}
          startIcon={<Iconify icon="eva:arrow-ios-back-fill" width={16} />}
          sx={{ mt: 3 }}
        >
          一覧へ戻る
        </Button>
      }
      sx={{ py: 10 }}
    />
  );

  const renderAdKeyword = adKeyword && (
    <>
      <CustomBreadcrumbs
        heading="広告キーワードマスタ詳細"
        links={[
          { name: "ダッシュボード", href: paths.admin.dashboard },
          {
            name: "広告キーワードマスタ",
            href: paths.admin.adKeyword.root,
          },
          { name: `# ${adKeyword?.id}` },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <AdKeywordDetailToolbar
        backLink={paths.admin.adKeyword.root}
        editLink={paths.admin.adKeyword.edit(`${adKeyword?.id}`)}
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
              参照元
            </Typography>
            <Typography variant="body2" sx={{ flexGrow: 1 }}>
              {adKeyword.utm_source}
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
              メディア
            </Typography>
            <Typography variant="body2" sx={{ flexGrow: 1 }}>
              {adKeyword.utm_medium}
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
              キャンペーン
            </Typography>
            <Typography variant="body2" sx={{ flexGrow: 1 }}>
              {adKeyword.utm_campaign}
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
              キーワードID
            </Typography>
            <Typography variant="body2" sx={{ flexGrow: 1 }}>
              {adKeyword.keyword_id}
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
              広告グループ
            </Typography>
            <Typography variant="body2" sx={{ flexGrow: 1 }}>
              {adKeyword.ad_group}
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
              キーワード
            </Typography>
            <Typography variant="body2" sx={{ flexGrow: 1 }}>
              {adKeyword.keyword}
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
              マッチ種別
            </Typography>
            <Label variant="soft" color={"default"}>
              {adKeyword.match_type_name}
            </Label>
          </Stack>
        </Stack>
      </Card>
    </>
  );

  return (
    <Container maxWidth={settings.themeStretch ? false : "lg"}>
      {adKeywordLoading && renderSkeleton}

      {adKeywordError && renderError}

      {adKeyword && renderAdKeyword}
    </Container>
  );
}
