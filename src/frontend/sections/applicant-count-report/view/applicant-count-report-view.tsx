"use client";

import { useCallback, useState } from "react";

import Grid from "@mui/material/Unstable_Grid2";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";

import { paths } from "@/routes/paths";
import { useRouter } from "@/routes/hooks";

import { useSettingsContext } from "@/components/settings";

import { useGetApplicantCount } from "@/api/applicant-count-report";
import { useGetPrefectures } from "@/api/prefecture";
import { useGetGovernmentCities } from "@/api/government-city";
import { useGetCities } from "@/api/city";

import { IApplicantCountReportFilters } from "@/types/applicant-count-report";

import ApplicantCountWidgetSummary from "../applicant-count-widget-summary";
import ApplicantCountReportByApplicantAddressTable from "../applicant-count-report-by-applicant-address-table";
import ApplicantCountReportByOfficeAddressTable from "../applicant-count-report-by-office-address-table";
import ApplicantCountReportToolbar from "../applicant-count-report-toolbar";

// ----------------------------------------------------------------------

const defaultFilters: IApplicantCountReportFilters = {
  prefecture_id: "",
  government_city_id: "",
  city_id: "",
  from: "",
  to: "",
};

type Props = {
  prefectureId: string;
  governmentCityId: string;
  cityId: string;
  from: string;
  to: string;
};

// ----------------------------------------------------------------------

export default function ApplicantCountReportView({
  prefectureId,
  governmentCityId,
  cityId,
  from,
  to,
}: Props) {
  const router = useRouter();
  const settings = useSettingsContext();

  // パラメータより検索条件を設定
  let initFilters = defaultFilters;
  initFilters.prefecture_id = prefectureId || "";
  initFilters.government_city_id = governmentCityId || "";
  initFilters.city_id = cityId || "";
  initFilters.from = from || "";
  initFilters.to = to || "";
  const [filters, setFilters] = useState(defaultFilters);

  const {
    applicantCountByApplicantAddress,
    applicantAllCountByApplicantAddress,
    officeCount,
    applicantCountByOfficeAddress,
    applicantAllCountByOfficeAddress,
    applicantCountLoading,
  } = useGetApplicantCount(
    filters.prefecture_id,
    filters.government_city_id,
    filters.city_id,
    filters.from,
    filters.to
  );

  const { prefectures } = useGetPrefectures();
  const { governmentCities } = useGetGovernmentCities();
  const { cities } = useGetCities();

  // 検索
  const handleFilters = useCallback(
    (newFilters: IApplicantCountReportFilters) => {
      setFilters(newFilters);
      prefectureId = newFilters.prefecture_id;
      governmentCityId = newFilters.government_city_id;
      cityId = newFilters.city_id;
      from = newFilters.from;
      to = newFilters.to;

      // URL変更
      let url = paths.admin.applicantCountReport.root;
      let params: {
        [prop: string]: any;
      } = {};
      if (prefectureId) params.prefecture_id = prefectureId;
      if (governmentCityId) params.government_city_id = governmentCityId;
      if (cityId) params.city_id = cityId;
      if (from) params.from = from;
      if (to) params.to = to;
      const urlSearchParam = new URLSearchParams(params).toString();
      if (urlSearchParam) url += "?" + urlSearchParam;
      router.push(url);
    },
    [router]
  );

  // 検索条件クリア
  const handleResetFilters = useCallback(() => {
    setFilters(defaultFilters);
    router.push(paths.admin.applicantCountReport.root);
  }, [router]);

  return (
    <Container maxWidth={settings.themeStretch ? false : "xl"}>
      <Typography
        variant="h4"
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      >
        応募件数レポート
      </Typography>

      <ApplicantCountReportToolbar
        filters={filters}
        searchLoading={applicantCountLoading}
        onFilters={handleFilters}
        onClearFilters={handleResetFilters}
        prefectures={prefectures}
        governmentCities={governmentCities}
        cities={cities}
      />

      <Grid container spacing={3}>
        <Grid xs={12} sm={6} md={3}>
          <ApplicantCountWidgetSummary
            title="応募数（応募者の住所起点）"
            total={applicantAllCountByApplicantAddress}
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <ApplicantCountWidgetSummary title="事業所数" total={officeCount} />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <ApplicantCountWidgetSummary
            title="応募数（事業所の住所起点）"
            total={applicantAllCountByOfficeAddress}
          />
        </Grid>

        <Grid xs={12}>
          <ApplicantCountReportByApplicantAddressTable
            title="応募数（応募者の住所起点）"
            tableLabels={[
              { id: "prefecture", label: "都道府県" },
              { id: "government_city", label: "政令指定都市" },
              { id: "city", label: "市区町村" },
              { id: "count", label: "応募数" },
            ]}
            tableData={applicantCountByApplicantAddress}
          />
        </Grid>

        <Grid xs={12}>
          <ApplicantCountReportByOfficeAddressTable
            title="応募数（事業所の住所起点）"
            tableLabels={[
              { id: "office", label: "事業所" },
              { id: "prefecture", label: "都道府県" },
              { id: "government_city", label: "政令指定都市" },
              { id: "city", label: "市区町村" },
              { id: "count", label: "応募数" },
            ]}
            tableData={applicantCountByOfficeAddress}
          />
        </Grid>
      </Grid>
    </Container>
  );
}
