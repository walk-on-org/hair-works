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
  },
  position: {
    list: "/api/positions",
    detail: (id: string) => `/api/positions/${id}`,
    create: "/api/positions/create",
    update: (id: string) => `/api/positions/update/${id}`,
  },
  employment: {
    list: "/api/employments",
    detail: (id: string) => `/api/employments/${id}`,
    create: "/api/employments/create",
    update: (id: string) => `/api/employments/update/${id}`,
  },
  prefecture: {
    list: "/api/prefectures",
    detail: (id: string) => `/api/prefectures/${id}`,
    create: "/api/prefectures/create",
    update: (id: string) => `/api/prefectures/update/${id}`,
  },
  governmentCity: {
    list: "/api/government_cities",
    detail: (id: string) => `/api/government_cities/${id}`,
    create: "/api/government_cities/create",
    update: (id: string) => `/api/government_cities/update/${id}`,
  },
  city: {
    list: "/api/cities",
    detail: (id: string) => `/api/cities/${id}`,
    create: "/api/cities/create",
    update: (id: string) => `/api/cities/update/${id}`,
  },
  trainCompany: {
    list: "/api/train_companies",
    detail: (id: string) => `/api/train_companies/${id}`,
    create: "/api/train_companies/create",
    update: (id: string) => `/api/train_companies/update/${id}`,
  },
  line: {
    list: "/api/lines",
    detail: (id: string) => `/api/lines/${id}`,
    create: "/api/lines/create",
    update: (id: string) => `/api/lines/update/${id}`,
  },
  station: {
    list: "/api/stations",
    detail: (id: string) => `/api/stations/${id}`,
    create: "/api/stations/create",
    update: (id: string) => `/api/stations/update/${id}`,
  },
  holiday: {
    list: "/api/holidays",
    detail: (id: string) => `/api/holidays/${id}`,
    create: "/api/holidays/create",
    update: (id: string) => `/api/holidays/update/${id}`,
  },
  commitmentTerm: {
    list: "/api/commitment_terms",
    detail: (id: string) => `/api/commitment_terms/${id}`,
    create: "/api/commitment_terms/create",
    update: (id: string) => `/api/commitment_terms/update/${id}`,
  },
  qualification: {
    list: "/api/qualifications",
    detail: (id: string) => `/api/qualifications/${id}`,
    create: "/api/qualifications/create",
    update: (id: string) => `/api/qualifications/update/${id}`,
  },
  lpJobCategory: {
    list: "/api/lp_job_categories",
    detail: (id: string) => `/api/lp_job_categories/${id}`,
    create: "/api/lp_job_categories/create",
    update: (id: string) => `/api/lp_job_categories/update/${id}`,
  },
  plan: {
    list: "/api/plans",
    detail: (id: string) => `/api/plans/${id}`,
    create: "/api/plans/create",
    update: (id: string) => `/api/plans/update/${id}`,
  },
  htmlAddContent: {
    list: "/api/html_add_contents",
    detail: (id: string) => `/api/html_add_contents/${id}`,
    create: "/api/html_add_contents/create",
    update: (id: string) => `/api/html_add_contents/update/${id}`,
  },
  nationalHoliday: {
    list: "/api/national_holidays",
    detail: (id: string) => `/api/national_holidays/${id}`,
    create: "/api/national_holidays/create",
    update: (id: string) => `/api/national_holidays/update/${id}`,
  },
  adKeyword: {
    list: "/api/ad_keywords",
    detail: (id: string) => `/api/ad_keywords/${id}`,
    create: "/api/ad_keywords/create",
    update: (id: string) => `/api/ad_keywords/update/${id}`,
  },
};
