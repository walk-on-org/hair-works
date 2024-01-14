import { MailmagazineConfigListView } from "@/sections/mailmagazine-config/view";

// ----------------------------------------------------------------------

export const metadata = {
  title: "メルマガ設定一覧",
};

export default function MailmagazineConfigListPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  return (
    <MailmagazineConfigListView
      title={searchParams.title ? String(searchParams.title) : ""}
      page={searchParams.page ? Number(searchParams.page) : 1}
      limit={searchParams.limit ? Number(searchParams.limit) : 30}
      orderBy={searchParams.orderBy ? String(searchParams.orderBy) : "id"}
      order={
        searchParams.order && String(searchParams.order) == "asc"
          ? "asc"
          : "desc"
      }
    />
  );
}
