import { CorporationListView } from "@/sections/corporation/view";

// ----------------------------------------------------------------------

export const metadata = {
  title: "法人一覧",
};

export default function CorporationListPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  return (
    <CorporationListView
      corporationName={
        searchParams.corporation_name
          ? String(searchParams.corporation_name)
          : ""
      }
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
