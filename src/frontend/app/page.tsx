import { Stack } from "@mui/material";
import Link from "next/link";

export default async function Home() {
  return (
    <Stack spacing={1} alignItems="center">
      <Link href={`/admin/login`}>ログイン</Link>
      <Link href={`/admin/dashboard`}>ダッシュボード</Link>
    </Stack>
  );
}
