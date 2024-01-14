import { HistoryListView } from "@/sections/history/view";

// ----------------------------------------------------------------------

export const metadata = {
  title: "閲覧履歴",
};

export default function HistoryListPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  let jobCategory: string[] = [];
  if (searchParams.job_category_id) {
    jobCategory = Array.isArray(searchParams.job_category_id)
      ? searchParams.job_category_id
      : searchParams.job_category_id.split(",");
  }

  let position: string[] = [];
  if (searchParams.position_id) {
    position = Array.isArray(searchParams.position_id)
      ? searchParams.position_id
      : searchParams.position_id.split(",");
  }

  let employment: string[] = [];
  if (searchParams.employment_id) {
    employment = Array.isArray(searchParams.employment_id)
      ? searchParams.employment_id
      : searchParams.employment_id.split(",");
  }

  return (
    <HistoryListView
      corporationName={
        searchParams.corporation_name
          ? String(searchParams.corporation_name)
          : ""
      }
      officeName={
        searchParams.office_name ? String(searchParams.office_name) : ""
      }
      jobName={searchParams.job_name ? String(searchParams.job_name) : ""}
      jobCategory={jobCategory}
      position={position}
      employment={employment}
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
