"use client";

import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";

import { paths } from "@/routes/paths";
import { RouterLink } from "@/routes/components";

import { useGetAdminUser } from "@/api/admin-user";

import CustomBreadcrumbs from "@/components/custom-breadcrumbs";
import Iconify from "@/components/iconify";
import EmptyContent from "@/components/empty-content";
import { useSettingsContext } from "@/components/settings";

import AdminUserDetailToolbar from "../admin-user-detail-toolbar";
import { AdminUserDetailSkeleton } from "../admin-user-skelton";

// ----------------------------------------------------------------------

type Props = {
  id: string;
};

export default function AdminUserDetailView({ id }: Props) {
  const { adminUser, adminUserLoading, adminUserError } = useGetAdminUser(id);

  const settings = useSettingsContext();

  const renderSkeleton = <AdminUserDetailSkeleton />;

  const renderError = (
    <EmptyContent
      filled
      title={`${adminUserError?.message}`}
      action={
        <Button
          component={RouterLink}
          href={paths.admin.adminUser.root}
          startIcon={<Iconify icon="eva:arrow-ios-back-fill" width={16} />}
          sx={{ mt: 3 }}
        >
          一覧へ戻る
        </Button>
      }
      sx={{ py: 10 }}
    />
  );

  const renderAdminUser = adminUser && (
    <>
      <CustomBreadcrumbs
        heading="管理者ユーザ詳細"
        links={[
          { name: "ダッシュボード", href: paths.admin.dashboard },
          {
            name: "管理者ユーザ",
            href: paths.admin.adminUser.root,
          },
          { name: adminUser?.name },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <AdminUserDetailToolbar
        backLink={paths.admin.adminUser.root}
        editLink={paths.admin.adminUser.edit(`${adminUser?.id}`)}
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
              氏名
            </Typography>
            <Typography variant="body2" sx={{ flexGrow: 1 }}>
              {adminUser.name}
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
              {adminUser.tel}
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
              {adminUser.email}
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
              パスワード
            </Typography>
            <Typography variant="body2" sx={{ flexGrow: 1 }}>
              {adminUser.password}
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
              権限
            </Typography>
            <Typography variant="body2" sx={{ flexGrow: 1 }}>
              {adminUser.admin_role_name}
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
              {adminUser.corporation_names.join("、")}
            </Typography>
          </Stack>
        </Stack>
      </Card>
    </>
  );

  return (
    <Container maxWidth={settings.themeStretch ? false : "lg"}>
      {adminUserLoading && renderSkeleton}

      {adminUserError && renderError}

      {adminUser && renderAdminUser}
    </Container>
  );
}
