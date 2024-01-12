import { OfficeListView } from "@/sections/office/view";

// ----------------------------------------------------------------------

export const metadata = {
  title: "事業所一覧",
};

export default function OfficeListPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  return (
    <OfficeListView
      corporationName={
        searchParams.corporation_name
          ? String(searchParams.corporation_name)
          : ""
      }
      officeName={
        searchParams.office_name ? String(searchParams.office_name) : ""
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
