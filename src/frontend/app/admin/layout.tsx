"use client";

import { AuthGuard, GuestGuard } from "@/auth/guard";
import AdminLayout from "@/layouts/admin";
import AuthLayout from "@/layouts/auth";
import { usePathname } from "@/routes/hooks/use-pathname";

type Props = {
  children: React.ReactNode;
};

export default function Layout({ children }: Props) {
  const pathname = usePathname();

  return (
    <>
      {pathname.startsWith("/admin/login") ||
      pathname.startsWith("/admin/password") ? (
        <GuestGuard>
          <AuthLayout>{children}</AuthLayout>
        </GuestGuard>
      ) : (
        <AuthGuard>
          <AdminLayout>{children}</AdminLayout>
        </AuthGuard>
      )}
    </>
  );
}
