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
    list: "/api/admin/job_categories",
    detail: (id: string) => `/api/admin/job_categories/${id}`,
    create: "/api/admin/job_categories/create",
    update: (id: string) => `/api/admin/job_categories/update/${id}`,
    destroy: (id: string) => `/api/admin/job_categories/destroy/${id}`,
    destroyMultiple: "/api/admin/job_categories/destroy_multiple",
  },
  position: {
    list: "/api/admin/positions",
    detail: (id: string) => `/api/admin/positions/${id}`,
    create: "/api/admin/positions/create",
    update: (id: string) => `/api/admin/positions/update/${id}`,
    destroy: (id: string) => `/api/admin/positions/destroy/${id}`,
    destroyMultiple: "/api/admin/positions/destroy_multiple",
  },
  employment: {
    list: "/api/admin/employments",
    detail: (id: string) => `/api/admin/employments/${id}`,
    create: "/api/admin/employments/create",
    update: (id: string) => `/api/admin/employments/update/${id}`,
    destroy: (id: string) => `/api/admin/employments/destroy/${id}`,
    destroyMultiple: "/api/admin/employments/destroy_multiple",
  },
  prefecture: {
    list: "/api/admin/prefectures",
    detail: (id: string) => `/api/admin/prefectures/${id}`,
    create: "/api/admin/prefectures/create",
    update: (id: string) => `/api/admin/prefectures/update/${id}`,
    destroy: (id: string) => `/api/admin/prefectures/destroy/${id}`,
    destroyMultiple: "/api/admin/prefectures/destroy_multiple",
  },
  governmentCity: {
    list: "/api/admin/government_cities",
    detail: (id: string) => `/api/admin/government_cities/${id}`,
    create: "/api/admin/government_cities/create",
    update: (id: string) => `/api/admin/government_cities/update/${id}`,
    destroy: (id: string) => `/api/admin/government_cities/destroy/${id}`,
    destroyMultiple: "/api/admin/government_cities/destroy_multiple",
  },
  city: {
    list: "/api/admin/cities",
    detail: (id: string) => `/api/admin/cities/${id}`,
    create: "/api/admin/cities/create",
    update: (id: string) => `/api/admin/cities/update/${id}`,
    destroy: (id: string) => `/api/admin/cities/destroy/${id}`,
    destroyMultiple: "/api/admin/cities/destroy_multiple",
  },
  trainCompany: {
    list: "/api/admin/train_companies",
    detail: (id: string) => `/api/admin/train_companies/${id}`,
    create: "/api/admin/train_companies/create",
    update: (id: string) => `/api/admin/train_companies/update/${id}`,
    destroy: (id: string) => `/api/admin/train_companies/destroy/${id}`,
    destroyMultiple: "/api/admin/train_companies/destroy_multiple",
  },
  line: {
    list: "/api/admin/lines",
    detail: (id: string) => `/api/admin/lines/${id}`,
    create: "/api/admin/lines/create",
    update: (id: string) => `/api/admin/lines/update/${id}`,
    destroy: (id: string) => `/api/admin/lines/destroy/${id}`,
    destroyMultiple: "/api/admin/lines/destroy_multiple",
  },
  station: {
    list: "/api/admin/stations",
    detail: (id: string) => `/api/admin/stations/${id}`,
    create: "/api/admin/stations/create",
    update: (id: string) => `/api/admin/stations/update/${id}`,
    destroy: (id: string) => `/api/admin/stations/destroy/${id}`,
    destroyMultiple: "/api/admin/stations/destroy_multiple",
  },
  holiday: {
    list: "/api/admin/holidays",
    detail: (id: string) => `/api/admin/holidays/${id}`,
    create: "/api/admin/holidays/create",
    update: (id: string) => `/api/admin/holidays/update/${id}`,
    destroy: (id: string) => `/api/admin/holidays/destroy/${id}`,
    destroyMultiple: "/api/admin/holidays/destroy_multiple",
  },
  commitmentTerm: {
    list: "/api/admin/commitment_terms",
    detail: (id: string) => `/api/admin/commitment_terms/${id}`,
    create: "/api/admin/commitment_terms/create",
    update: (id: string) => `/api/admin/commitment_terms/update/${id}`,
    destroy: (id: string) => `/api/admin/commitment_terms/destroy/${id}`,
    destroyMultiple: "/api/admin/commitment_terms/destroy_multiple",
  },
  qualification: {
    list: "/api/admin/qualifications",
    detail: (id: string) => `/api/admin/qualifications/${id}`,
    create: "/api/admin/qualifications/create",
    update: (id: string) => `/api/admin/qualifications/update/${id}`,
    destroy: (id: string) => `/api/admin/qualifications/destroy/${id}`,
    destroyMultiple: "/api/admin/qualifications/destroy_multiple",
  },
  lpJobCategory: {
    list: "/api/admin/lp_job_categories",
    detail: (id: string) => `/api/admin/lp_job_categories/${id}`,
    create: "/api/admin/lp_job_categories/create",
    update: (id: string) => `/api/admin/lp_job_categories/update/${id}`,
    destroy: (id: string) => `/api/admin/lp_job_categories/destroy/${id}`,
    destroyMultiple: "/api/admin/lp_job_categories/destroy_multiple",
  },
  plan: {
    list: "/api/admin/plans",
    detail: (id: string) => `/api/admin/plans/${id}`,
    create: "/api/admin/plans/create",
    update: (id: string) => `/api/admin/plans/update/${id}`,
    destroy: (id: string) => `/api/admin/plans/destroy/${id}`,
    destroyMultiple: "/api/admin/plans/destroy_multiple",
  },
  htmlAddContent: {
    list: "/api/admin/html_add_contents",
    detail: (id: string) => `/api/admin/html_add_contents/${id}`,
    create: "/api/admin/html_add_contents/create",
    update: (id: string) => `/api/admin/html_add_contents/update/${id}`,
    destroy: (id: string) => `/api/admin/html_add_contents/destroy/${id}`,
    destroyMultiple: "/api/admin/html_add_contents/destroy_multiple",
  },
  nationalHoliday: {
    list: "/api/admin/national_holidays",
    detail: (id: string) => `/api/admin/national_holidays/${id}`,
    create: "/api/admin/national_holidays/create",
    update: (id: string) => `/api/admin/national_holidays/update/${id}`,
    destroy: (id: string) => `/api/admin/national_holidays/destroy/${id}`,
    destroyMultiple: "/api/admin/national_holidays/destroy_multiple",
  },
  adKeyword: {
    list: "/api/admin/ad_keywords",
    detail: (id: string) => `/api/admin/ad_keywords/${id}`,
    create: "/api/admin/ad_keywords/create",
    update: (id: string) => `/api/admin/ad_keywords/update/${id}`,
    destroy: (id: string) => `/api/admin/ad_keywords/destroy/${id}`,
    destroyMultiple: "/api/admin/ad_keywords/destroy_multiple",
  },
  customLp: {
    list: "/api/admin/custom_lps",
    detail: (id: string) => `/api/admin/custom_lps/${id}`,
    create: "/api/admin/custom_lps/create",
    update: (id: string) => `/api/admin/custom_lps/update/${id}`,
    destroy: (id: string) => `/api/admin/custom_lps/destroy/${id}`,
    destroyMultiple: "/api/admin/custom_lps/destroy_multiple",
  },

  corporation: {
    list: "/api/admin/corporations",
    detail: (id: string) => `/api/admin/corporations/${id}`,
    create: "/api/admin/corporations/create",
    update: (id: string) => `/api/admin/corporations/update/${id}`,
    destroy: (id: string) => `/api/admin/corporations/destroy/${id}`,
    destroyMultiple: "/api/admin/corporations/destroy_multiple",
  },
  office: {
    list: "/api/admin/offices",
    detail: (id: string) => `/api/admin/offices/${id}`,
    create: "/api/admin/offices/create",
    update: (id: string) => `/api/admin/offices/update/${id}`,
    destroy: (id: string) => `/api/admin/offices/destroy/${id}`,
    destroyMultiple: "/api/admin/offices/destroy_multiple",
  },
  job: {
    list: "/api/admin/jobs",
    detail: (id: string) => `/api/admin/jobs/${id}`,
    create: "/api/admin/jobs/create",
    update: (id: string) => `/api/admin/jobs/update/${id}`,
    destroy: (id: string) => `/api/admin/jobs/destroy/${id}`,
    destroyMultiple: "/api/admin/jobs/destroy_multiple",
  },
  member: {
    list: "/api/admin/members",
    detail: (id: string) => `/api/admin/members/${id}`,
    update: (id: string) => `/api/admin/members/update/${id}`,
    destroy: (id: string) => `/api/admin/members/destroy/${id}`,
    destroyMultiple: "/api/admin/members/destroy_multiple",
  },
  applicant: {
    list: "/api/admin/applicants",
    detail: (id: string) => `/api/admin/applicants/${id}`,
    update: (id: string) => `/api/admin/applicants/update/${id}`,
  },
  inquiry: {
    list: "/api/admin/inquiries",
    detail: (id: string) => `/api/admin/inquiries/${id}`,
    update: (id: string) => `/api/admin/inquiries/update/${id}`,
    destroy: (id: string) => `/api/admin/inquiries/destroy/${id}`,
    destroyMultiple: "/api/admin/inquiries/destroy_multiple",
  },
  article: {
    list: "/api/admin/articles",
    detail: (id: string) => `/api/admin/articles/${id}`,
    create: "/api/admin/articles/create",
    update: (id: string) => `/api/admin/articles/update/${id}`,
    destroy: (id: string) => `/api/admin/articles/destroy/${id}`,
    destroyMultiple: "/api/admin/articles/destroy_multiple",
  },
  articleCategory: {
    list: "/api/admin/article_categories",
    detail: (id: string) => `/api/admin/article_categories/${id}`,
    create: "/api/admin/article_categories/create",
    update: (id: string) => `/api/admin/article_categories/update/${id}`,
    destroy: (id: string) => `/api/admin/article_categories/destroy/${id}`,
    destroyMultiple: "/api/admin/article_categories/destroy_multiple",
  },
  conversionHistory: {
    list: "/api/admin/conversion_histories",
  },
  keep: {
    list: "/api/admin/keeps",
  },
  history: {
    list: "/api/admin/histories",
  },
  mailmagazineConfig: {
    list: "/api/admin/mailmagazine_configs",
    detail: (id: string) => `/api/admin/mailmagazine_configs/${id}`,
    create: "/api/admin/mailmagazine_configs/create",
    update: (id: string) => `/api/admin/mailmagazine_configs/update/${id}`,
    destroy: (id: string) => `/api/admin/mailmagazine_configs/destroy/${id}`,
    destroyMultiple: "/api/admin/mailmagazine_configs/destroy_multiple",
  },
};
