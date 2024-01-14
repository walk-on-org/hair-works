import { ApplicantListView } from "@/sections/applicant/view";

// ----------------------------------------------------------------------

export const metadata = {
  title: "応募者一覧",
};

export default function ApplicantListPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  return (
    <ApplicantListView
      corporationName={
        searchParams.corporation_name
          ? String(searchParams.corporation_name)
          : ""
      }
      officeName={
        searchParams.office_name ? String(searchParams.office_name) : ""
      }
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
