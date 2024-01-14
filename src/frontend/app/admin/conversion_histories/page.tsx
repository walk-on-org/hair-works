import { ConversionHistoryListView } from "@/sections/conversion-history/view";

// ----------------------------------------------------------------------

export const metadata = {
  title: "CV経路",
};

export default function ConversionHistoryListPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  return (
    <ConversionHistoryListView
      utmSource={searchParams.utm_source ? String(searchParams.utm_source) : ""}
      utmMedium={searchParams.utm_medium ? String(searchParams.utm_medium) : ""}
      utmCampaign={
        searchParams.utm_campaign ? String(searchParams.utm_campaign) : ""
      }
      utmTerm={searchParams.utm_term ? String(searchParams.utm_term) : ""}
      lpUrl={searchParams.lp_url ? String(searchParams.lp_url) : ""}
      lpStartDate={
        searchParams.lp_start_date
          ? new Date(String(searchParams.lp_start_date))
          : null
      }
      lpEndDate={
        searchParams.lp_end_date
          ? new Date(String(searchParams.lp_end_date))
          : null
      }
      cvUrl={searchParams.cv_url ? String(searchParams.cv_url) : ""}
      cvStartDate={
        searchParams.cv_start_date
          ? new Date(String(searchParams.cv_start_date))
          : null
      }
      cvEndDate={
        searchParams.cv_end_date
          ? new Date(String(searchParams.cv_end_date))
          : null
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
