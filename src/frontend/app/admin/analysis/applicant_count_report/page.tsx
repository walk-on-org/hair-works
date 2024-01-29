import ApplicantCountReportView from "@/sections/applicant-count-report/view/applicant-count-report-view";

// ----------------------------------------------------------------------

export const metadata = {
  title: "応募件数レポート",
};

export default function ApplicantCountReportPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  return (
    <ApplicantCountReportView
      prefectureId={
        searchParams.prefecture_id ? String(searchParams.prefecture_id) : ""
      }
      governmentCityId={
        searchParams.government_city_id
          ? String(searchParams.government_city_id)
          : ""
      }
      cityId={searchParams.city_id ? String(searchParams.city_id) : ""}
      from={searchParams.from ? String(searchParams.from) : ""}
      to={searchParams.to ? String(searchParams.to) : ""}
    />
  );
}
