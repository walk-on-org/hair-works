"use client";

import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";

import { paths } from "@/routes/paths";
import { RouterLink } from "@/routes/components";

import { useGetCommitmentTerm } from "@/api/commitment-term";

import Label from "@/components/label";
import CustomBreadcrumbs from "@/components/custom-breadcrumbs";
import Iconify from "@/components/iconify";
import EmptyContent from "@/components/empty-content";
import { useSettingsContext } from "@/components/settings";

import CommitmentTermDetailToolbar from "../commitment-term-detail-toolbar";
import { CommitmentTermDetailSkeleton } from "../commitment-term-skelton";

// ----------------------------------------------------------------------

type Props = {
  id: string;
};

export default function CommitmentTermDetailView({ id }: Props) {
  const { commitmentTerm, commitmentTermLoading, commitmentTermError } =
    useGetCommitmentTerm(id);

  const settings = useSettingsContext();

  const renderSkeleton = <CommitmentTermDetailSkeleton />;

  const renderError = (
    <EmptyContent
      filled
      title={`${commitmentTermError?.message}`}
      action={
        <Button
          component={RouterLink}
          href={paths.admin.commitmentTerm.root}
          startIcon={<Iconify icon="eva:arrow-ios-back-fill" width={16} />}
          sx={{ mt: 3 }}
        >
          一覧へ戻る
        </Button>
      }
      sx={{ py: 10 }}
    />
  );

  const renderCommitmentTerm = commitmentTerm && (
    <>
      <CustomBreadcrumbs
        heading="こだわり条件マスタ詳細"
        links={[
          { name: "ダッシュボード", href: paths.admin.dashboard },
          {
            name: "こだわり条件マスタ",
            href: paths.admin.commitmentTerm.root,
          },
          { name: commitmentTerm?.name },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <CommitmentTermDetailToolbar
        backLink={paths.admin.commitmentTerm.root}
        editLink={paths.admin.commitmentTerm.edit(`${commitmentTerm?.id}`)}
      />

      <Card>
        <Stack spacing={3} sx={{ p: 3 }}>
          <Stack direction="row">
            <Typography variant="subtitle2" sx={{ width: 160 }}>
              こだわり条件名
            </Typography>
            <Typography variant="body2" sx={{ flexGrow: 1 }}>
              {commitmentTerm.name}
            </Typography>
          </Stack>

          <Stack direction="row">
            <Typography variant="subtitle2" sx={{ width: 160 }}>
              パーマリンク
            </Typography>
            <Typography variant="body2" sx={{ flexGrow: 1 }}>
              {commitmentTerm.permalink}
            </Typography>
          </Stack>

          <Stack direction="row">
            <Typography variant="subtitle2" sx={{ width: 160 }}>
              カテゴリ
            </Typography>
            <Typography variant="body2" sx={{ flexGrow: 1 }}>
              {commitmentTerm.category_name}
            </Typography>
          </Stack>

          <Stack direction="row">
            <Typography variant="subtitle2" sx={{ width: 160 }}>
              おすすめ
            </Typography>
            <Label
              variant="soft"
              color={(commitmentTerm.recommend == "1" && "info") || "default"}
            >
              {commitmentTerm.recommend_name}
            </Label>
          </Stack>

          <Stack direction="row">
            <Typography variant="subtitle2" sx={{ width: 160 }}>
              状態
            </Typography>
            <Label
              variant="soft"
              color={(commitmentTerm.status == "1" && "info") || "default"}
            >
              {commitmentTerm.status_name}
            </Label>
          </Stack>
        </Stack>
      </Card>
    </>
  );

  return (
    <Container maxWidth={settings.themeStretch ? false : "lg"}>
      {commitmentTermLoading && renderSkeleton}

      {commitmentTermError && renderError}

      {commitmentTerm && renderCommitmentTerm}
    </Container>
  );
}
