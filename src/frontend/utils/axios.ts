import axios, { AxiosRequestConfig } from "axios";

// ----------------------------------------------------------------------

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_ENDOPOINT,
});

axiosInstance.interceptors.response.use(
  (res) => res,
  (error) =>
    Promise.reject(
      (error.response && error.response.data) || "Something went wrong"
    )
);

export default axiosInstance;

// ----------------------------------------------------------------------

export const fetcher: any = async (
  args: string | [string, AxiosRequestConfig]
) => {
  const [url, config] = Array.isArray(args) ? args : [args];

  const res = await axiosInstance.get(url, { ...config });

  return res.data;
};

// ----------------------------------------------------------------------

export const endpoints = {
  jobCategory: {
    list: "/api/job_categories",
    detail: (id: string) => `/api/job_categories/${id}`,
    create: "/api/job_categories/create",
    update: (id: string) => `/api/job_categories/update/${id}`,
    destroy: (id: string) => `/api/job_categories/destroy/${id}`,
    destroyMultiple: "/api/job_categories/destroy_multiple",
  },
  position: {
    list: "/api/positions",
    detail: (id: string) => `/api/positions/${id}`,
    create: "/api/positions/create",
    update: (id: string) => `/api/positions/update/${id}`,
    destroy: (id: string) => `/api/positions/destroy/${id}`,
    destroyMultiple: "/api/positions/destroy_multiple",
  },
  employment: {
    list: "/api/employments",
    detail: (id: string) => `/api/employments/${id}`,
    create: "/api/employments/create",
    update: (id: string) => `/api/employments/update/${id}`,
    destroy: (id: string) => `/api/employments/destroy/${id}`,
    destroyMultiple: "/api/employments/destroy_multiple",
  },
  prefecture: {
    list: "/api/prefectures",
    detail: (id: string) => `/api/prefectures/${id}`,
    create: "/api/prefectures/create",
    update: (id: string) => `/api/prefectures/update/${id}`,
    destroy: (id: string) => `/api/prefectures/destroy/${id}`,
    destroyMultiple: "/api/prefectures/destroy_multiple",
  },
  governmentCity: {
    list: "/api/government_cities",
    detail: (id: string) => `/api/government_cities/${id}`,
    create: "/api/government_cities/create",
    update: (id: string) => `/api/government_cities/update/${id}`,
    destroy: (id: string) => `/api/government_cities/destroy/${id}`,
    destroyMultiple: "/api/government_cities/destroy_multiple",
  },
  city: {
    list: "/api/cities",
    detail: (id: string) => `/api/cities/${id}`,
    create: "/api/cities/create",
    update: (id: string) => `/api/cities/update/${id}`,
    destroy: (id: string) => `/api/cities/destroy/${id}`,
    destroyMultiple: "/api/cities/destroy_multiple",
  },
  trainCompany: {
    list: "/api/train_companies",
    detail: (id: string) => `/api/train_companies/${id}`,
    create: "/api/train_companies/create",
    update: (id: string) => `/api/train_companies/update/${id}`,
    destroy: (id: string) => `/api/train_companies/destroy/${id}`,
    destroyMultiple: "/api/train_companies/destroy_multiple",
  },
  line: {
    list: "/api/lines",
    detail: (id: string) => `/api/lines/${id}`,
    create: "/api/lines/create",
    update: (id: string) => `/api/lines/update/${id}`,
    destroy: (id: string) => `/api/lines/destroy/${id}`,
    destroyMultiple: "/api/lines/destroy_multiple",
  },
  station: {
    list: "/api/stations",
    detail: (id: string) => `/api/stations/${id}`,
    create: "/api/stations/create",
    update: (id: string) => `/api/stations/update/${id}`,
    destroy: (id: string) => `/api/stations/destroy/${id}`,
    destroyMultiple: "/api/stations/destroy_multiple",
  },
  holiday: {
    list: "/api/holidays",
    detail: (id: string) => `/api/holidays/${id}`,
    create: "/api/holidays/create",
    update: (id: string) => `/api/holidays/update/${id}`,
    destroy: (id: string) => `/api/holidays/destroy/${id}`,
    destroyMultiple: "/api/holidays/destroy_multiple",
  },
  commitmentTerm: {
    list: "/api/commitment_terms",
    detail: (id: string) => `/api/commitment_terms/${id}`,
    create: "/api/commitment_terms/create",
    update: (id: string) => `/api/commitment_terms/update/${id}`,
    destroy: (id: string) => `/api/commitment_terms/destroy/${id}`,
    destroyMultiple: "/api/commitment_terms/destroy_multiple",
  },
  qualification: {
    list: "/api/qualifications",
    detail: (id: string) => `/api/qualifications/${id}`,
    create: "/api/qualifications/create",
    update: (id: string) => `/api/qualifications/update/${id}`,
    destroy: (id: string) => `/api/qualifications/destroy/${id}`,
    destroyMultiple: "/api/qualifications/destroy_multiple",
  },
  lpJobCategory: {
    list: "/api/lp_job_categories",
    detail: (id: string) => `/api/lp_job_categories/${id}`,
    create: "/api/lp_job_categories/create",
    update: (id: string) => `/api/lp_job_categories/update/${id}`,
    destroy: (id: string) => `/api/lp_job_categories/destroy/${id}`,
    destroyMultiple: "/api/lp_job_categories/destroy_multiple",
  },
  plan: {
    list: "/api/plans",
    detail: (id: string) => `/api/plans/${id}`,
    create: "/api/plans/create",
    update: (id: string) => `/api/plans/update/${id}`,
    destroy: (id: string) => `/api/plans/destroy/${id}`,
    destroyMultiple: "/api/plans/destroy_multiple",
  },
  htmlAddContent: {
    list: "/api/html_add_contents",
    detail: (id: string) => `/api/html_add_contents/${id}`,
    create: "/api/html_add_contents/create",
    update: (id: string) => `/api/html_add_contents/update/${id}`,
    destroy: (id: string) => `/api/html_add_contents/destroy/${id}`,
    destroyMultiple: "/api/html_add_contents/destroy_multiple",
  },
  nationalHoliday: {
    list: "/api/national_holidays",
    detail: (id: string) => `/api/national_holidays/${id}`,
    create: "/api/national_holidays/create",
    update: (id: string) => `/api/national_holidays/update/${id}`,
    destroy: (id: string) => `/api/national_holidays/destroy/${id}`,
    destroyMultiple: "/api/national_holidays/destroy_multiple",
  },
  adKeyword: {
    list: "/api/ad_keywords",
    detail: (id: string) => `/api/ad_keywords/${id}`,
    create: "/api/ad_keywords/create",
    update: (id: string) => `/api/ad_keywords/update/${id}`,
    destroy: (id: string) => `/api/ad_keywords/destroy/${id}`,
    destroyMultiple: "/api/ad_keywords/destroy_multiple",
  },
  customLp: {
    list: "/api/custom_lps",
    detail: (id: string) => `/api/custom_lps/${id}`,
    create: "/api/custom_lps/create",
    update: (id: string) => `/api/custom_lps/update/${id}`,
    destroy: (id: string) => `/api/custom_lps/destroy/${id}`,
    destroyMultiple: "/api/custom_lps/destroy_multiple",
  },

  corporation: {
    list: "/api/corporations",
    detail: (id: string) => `/api/corporations/${id}`,
    create: "/api/corporations/create",
    update: (id: string) => `/api/corporations/update/${id}`,
    destroy: (id: string) => `/api/corporations/destroy/${id}`,
    destroyMultiple: "/api/corporations/destroy_multiple",
  },
  office: {
    list: "/api/offices",
    detail: (id: string) => `/api/offices/${id}`,
    create: "/api/offices/create",
    update: (id: string) => `/api/offices/update/${id}`,
    destroy: (id: string) => `/api/offices/destroy/${id}`,
    destroyMultiple: "/api/offices/destroy_multiple",
  },
  job: {
    list: "/api/jobs",
    detail: (id: string) => `/api/jobs/${id}`,
    create: "/api/jobs/create",
    update: (id: string) => `/api/jobs/update/${id}`,
    destroy: (id: string) => `/api/jobs/destroy/${id}`,
    destroyMultiple: "/api/jobs/destroy_multiple",
  },
};
