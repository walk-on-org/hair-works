"use client";

import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";

import { paths } from "@/routes/paths";
import { RouterLink } from "@/routes/components";

import { useGetAdminRole } from "@/api/admin-role";

import CustomBreadcrumbs from "@/components/custom-breadcrumbs";
import Iconify from "@/components/iconify";
import EmptyContent from "@/components/empty-content";
import { useSettingsContext } from "@/components/settings";

import AdminRoleDetailToolbar from "../admin-role-detail-toolbar";
import { AdminRoleDetailSkeleton } from "../admin-role-skelton";

// ----------------------------------------------------------------------

type Props = {
  id: string;
};

export default function AdminRoleDetailView({ id }: Props) {
  const { adminRole, adminRoleLoading, adminRoleError } = useGetAdminRole(id);

  const settings = useSettingsContext();

  const renderSkeleton = <AdminRoleDetailSkeleton />;

  const renderError = (
    <EmptyContent
      filled
      title={`${adminRoleError?.message}`}
      action={
        <Button
          component={RouterLink}
          href={paths.admin.adminRole.root}
          startIcon={<Iconify icon="eva:arrow-ios-back-fill" width={16} />}
          sx={{ mt: 3 }}
        >
          一覧へ戻る
        </Button>
      }
      sx={{ py: 10 }}
    />
  );

  const renderAdminRole = adminRole && (
    <>
      <CustomBreadcrumbs
        heading="管理者ロール詳細"
        links={[
          { name: "ダッシュボード", href: paths.admin.dashboard },
          {
            name: "管理者ロール",
            href: paths.admin.adminRole.root,
          },
          { name: adminRole?.name },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <AdminRoleDetailToolbar
        backLink={paths.admin.adminRole.root}
        editLink={paths.admin.adminRole.edit(`${adminRole?.id}`)}
      />

      <Card>
        <Stack spacing={3} sx={{ p: 3 }}>
          <Stack direction="row">
            <Typography variant="subtitle2" sx={{ width: 160 }}>
              ロール名
            </Typography>
            <Typography variant="body2" sx={{ flexGrow: 1 }}>
              {adminRole.name}
            </Typography>
          </Stack>
        </Stack>
      </Card>
    </>
  );

  return (
    <Container maxWidth={settings.themeStretch ? false : "lg"}>
      {adminRoleLoading && renderSkeleton}

      {adminRoleError && renderError}

      {adminRole && renderAdminRole}
    </Container>
  );
}
