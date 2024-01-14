import { InquiryListView } from "@/sections/inquiry/view";

// ----------------------------------------------------------------------

export const metadata = {
  title: "問い合わせ一覧",
};

export default function InquiryListPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  return (
    <InquiryListView
      salonName={searchParams.salon_name ? String(searchParams.salon_name) : ""}
      name={searchParams.name ? String(searchParams.name) : ""}
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
