"use client";

import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";

import { paths } from "@/routes/paths";
import { RouterLink } from "@/routes/components";

import { useGetInquiry } from "@/api/inquiry";

import Label from "@/components/label";
import CustomBreadcrumbs from "@/components/custom-breadcrumbs";
import Iconify from "@/components/iconify";
import EmptyContent from "@/components/empty-content";
import { useSettingsContext } from "@/components/settings";

import InquiryDetailToolbar from "../inquiry-detail-toolbar";
import { InquiryDetailSkeleton } from "../inquiry-skelton";
import { fDateTime } from "@/utils/format-time";

// ----------------------------------------------------------------------

type Props = {
  id: string;
};

export default function InquiryDetailView({ id }: Props) {
  const { inquiry, inquiryLoading, inquiryError } = useGetInquiry(id);
  const settings = useSettingsContext();

  const renderSkeleton = <InquiryDetailSkeleton />;

  const renderError = (
    <EmptyContent
      filled
      title={`${inquiryError?.message}`}
      action={
        <Button
          component={RouterLink}
          href={paths.admin.inquiry.root}
          startIcon={<Iconify icon="eva:arrow-ios-back-fill" width={16} />}
          sx={{ mt: 3 }}
        >
          一覧へ戻る
        </Button>
      }
      sx={{ py: 10 }}
    />
  );

  const renderInquiry = inquiry && (
    <>
      <CustomBreadcrumbs
        heading="問い合わせ詳細"
        links={[
          { name: "ダッシュボード", href: paths.admin.dashboard },
          {
            name: "問い合わせ",
            href: paths.admin.inquiry.root,
          },
          { name: inquiry?.name },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <InquiryDetailToolbar
        backLink={paths.admin.inquiry.root}
        editLink={paths.admin.inquiry.edit(`${inquiry?.id}`)}
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
              問い合わせID
            </Typography>
            <Typography variant="body2" sx={{ flexGrow: 1 }}>
              {inquiry.id}
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
            <Label
              variant="soft"
              color={(inquiry.status == "0" && "info") || "default"}
              width="fit-content"
            >
              {inquiry.status_name}
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
              サロン名/法人名
            </Typography>
            <Typography variant="body2" sx={{ flexGrow: 1 }}>
              {inquiry.salon_name}
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
              お名前
            </Typography>
            <Typography variant="body2" sx={{ flexGrow: 1 }}>
              {inquiry.name}
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
              サロン所在地（都道府県）
            </Typography>
            <Typography variant="body2" sx={{ flexGrow: 1 }}>
              {inquiry.prefecture_name}
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
              {inquiry.tel}
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
              {inquiry.mail}
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
              問い合わせ内容
            </Typography>
            <Typography variant="body2" sx={{ flexGrow: 1 }}>
              {inquiry.inquiry_type_name}
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
              補足事項
            </Typography>
            <Typography
              variant="body2"
              sx={{ flexGrow: 1, whiteSpace: "pre-wrap" }}
            >
              {inquiry.inquiry_note}
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
              登録日時
            </Typography>
            <Typography variant="body2" sx={{ flexGrow: 1 }}>
              {fDateTime(inquiry.created_at)}
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
              {inquiry.register_root}
            </Typography>
          </Stack>
        </Stack>
      </Card>
    </>
  );

  return (
    <Container maxWidth={settings.themeStretch ? false : "lg"}>
      {inquiryLoading && renderSkeleton}

      {inquiryError && renderError}

      {inquiry && renderInquiry}
    </Container>
  );
}
