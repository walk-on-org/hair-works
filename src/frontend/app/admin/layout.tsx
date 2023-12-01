"use client";
import AdminLayout from "@/layouts/admin";
import AuthLayout from "@/layouts/auth";
import { usePathname } from "@/routes/hooks/use-pathname";

type Props = {
  children: React.ReactNode;
};

export default function Layout({ children }: Props) {
  const pathname = usePathname();
  // TODO ログイン認証
  return (
    <>
      {pathname == "/admin/login" ? (
        <AuthLayout>{children}</AuthLayout>
      ) : (
        <AdminLayout>{children}</AdminLayout>
      )}
    </>
  );
}
