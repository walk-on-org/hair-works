import { string } from "yup";

const ROOTS = {
  ADMIN: "/admin",
};

// ----------------------------------------------------------------------

export const paths = {
  comingSoon: "/coming-soon",
  maintenance: "/maintenance",
  pricing: "/pricing",
  payment: "/payment",
  about: "/about-us",
  contact: "/contact-us",
  faqs: "/faqs",
  page403: "/error/403",
  page404: "/error/404",
  page500: "/error/500",
  components: "/components",

  // ADMIN
  admin: {
    root: ROOTS.ADMIN,
    dashboard: `${ROOTS.ADMIN}/dashboard`,
    corporation: {
      root: `${ROOTS.ADMIN}/corporations`,
      new: `${ROOTS.ADMIN}/corporations/new`,
      detail: (id: string) => `${ROOTS.ADMIN}/corporations/${id}`,
      edit: (id: string) => `${ROOTS.ADMIN}/corporations/${id}/edit`,
    },
    office: {
      root: `${ROOTS.ADMIN}/offices`,
      new: `${ROOTS.ADMIN}/offices/new`,
      detail: (id: string) => `${ROOTS.ADMIN}/offices/${id}`,
      edit: (id: string) => `${ROOTS.ADMIN}/offices/${id}/edit`,
    },
    job: {
      root: `${ROOTS.ADMIN}/jobs`,
      new: `${ROOTS.ADMIN}/jobs/new`,
      detail: (id: string) => `${ROOTS.ADMIN}/jobs/${id}`,
      edit: (id: string) => `${ROOTS.ADMIN}/jobs/${id}/edit`,
    },
    jobCategory: {
      root: `${ROOTS.ADMIN}/settings/job_categories`,
      new: `${ROOTS.ADMIN}/settings/job_categories/new`,
      detail: (id: string) => `${ROOTS.ADMIN}/settings/job_categories/${id}`,
      edit: (id: string) => `${ROOTS.ADMIN}/settings/job_categories/${id}/edit`,
    },
    position: {
      root: `${ROOTS.ADMIN}/settings/positions`,
      new: `${ROOTS.ADMIN}/settings/positions/new`,
      detail: (id: string) => `${ROOTS.ADMIN}/settings/positions/${id}`,
      edit: (id: string) => `${ROOTS.ADMIN}/settings/positions/${id}/edit`,
    },
    employment: {
      root: `${ROOTS.ADMIN}/settings/employments`,
      new: `${ROOTS.ADMIN}/settings/employments/new`,
      detail: (id: string) => `${ROOTS.ADMIN}/settings/employments/${id}`,
      edit: (id: string) => `${ROOTS.ADMIN}/settings/employments/${id}/edit`,
    },
    prefecture: {
      root: `${ROOTS.ADMIN}/settings/prefectures`,
      new: `${ROOTS.ADMIN}/settings/prefectures/new`,
      detail: (id: string) => `${ROOTS.ADMIN}/settings/prefectures/${id}`,
      edit: (id: string) => `${ROOTS.ADMIN}/settings/prefectures/${id}/edit`,
    },
    governmentCity: {
      root: `${ROOTS.ADMIN}/settings/government_cities`,
      new: `${ROOTS.ADMIN}/settings/government_cities/new`,
      detail: (id: string) => `${ROOTS.ADMIN}/settings/government_cities/${id}`,
      edit: (id: string) =>
        `${ROOTS.ADMIN}/settings/government_cities/${id}/edit`,
    },
    city: {
      root: `${ROOTS.ADMIN}/settings/cities`,
      new: `${ROOTS.ADMIN}/settings/cities/new`,
      detail: (id: string) => `${ROOTS.ADMIN}/settings/cities/${id}`,
      edit: (id: string) => `${ROOTS.ADMIN}/settings/cities/${id}/edit`,
    },
    trainCompany: {
      root: `${ROOTS.ADMIN}/settings/train_companies`,
      new: `${ROOTS.ADMIN}/settings/train_companies/new`,
      detail: (id: string) => `${ROOTS.ADMIN}/settings/train_companies/${id}`,
      edit: (id: string) =>
        `${ROOTS.ADMIN}/settings/train_companies/${id}/edit`,
    },
    line: {
      root: `${ROOTS.ADMIN}/settings/lines`,
      new: `${ROOTS.ADMIN}/settings/lines/new`,
      detail: (id: string) => `${ROOTS.ADMIN}/settings/lines/${id}`,
      edit: (id: string) => `${ROOTS.ADMIN}/settings/lines/${id}/edit`,
    },
    station: {
      root: `${ROOTS.ADMIN}/settings/stations`,
      new: `${ROOTS.ADMIN}/settings/stations/new`,
      detail: (id: string) => `${ROOTS.ADMIN}/settings/stations/${id}`,
      edit: (id: string) => `${ROOTS.ADMIN}/settings/stations/${id}/edit`,
    },
    holiday: {
      root: `${ROOTS.ADMIN}/settings/holidays`,
      new: `${ROOTS.ADMIN}/settings/holidays/new`,
      detail: (id: string) => `${ROOTS.ADMIN}/settings/holidays/${id}`,
      edit: (id: string) => `${ROOTS.ADMIN}/settings/holidays/${id}/edit`,
    },
    commitmentTerm: {
      root: `${ROOTS.ADMIN}/settings/commitment_terms`,
      new: `${ROOTS.ADMIN}/settings/commitment_terms/new`,
      detail: (id: string) => `${ROOTS.ADMIN}/settings/commitment_terms/${id}`,
      edit: (id: string) =>
        `${ROOTS.ADMIN}/settings/commitment_terms/${id}/edit`,
    },
    qualification: {
      root: `${ROOTS.ADMIN}/settings/qualifications`,
      new: `${ROOTS.ADMIN}/settings/qualifications/new`,
      detail: (id: string) => `${ROOTS.ADMIN}/settings/qualifications/${id}`,
      edit: (id: string) => `${ROOTS.ADMIN}/settings/qualifications/${id}/edit`,
    },
    lpJobCategory: {
      root: `${ROOTS.ADMIN}/settings/lp_job_categories`,
      new: `${ROOTS.ADMIN}/settings/lp_job_categories/new`,
      detail: (id: string) => `${ROOTS.ADMIN}/settings/lp_job_categories/${id}`,
      edit: (id: string) =>
        `${ROOTS.ADMIN}/settings/lp_job_categories/${id}/edit`,
    },
    plan: {
      root: `${ROOTS.ADMIN}/settings/plans`,
      new: `${ROOTS.ADMIN}/settings/plans/new`,
      detail: (id: string) => `${ROOTS.ADMIN}/settings/plans/${id}`,
      edit: (id: string) => `${ROOTS.ADMIN}/settings/plans/${id}/edit`,
    },
    htmlAddContent: {
      root: `${ROOTS.ADMIN}/settings/html_add_contents`,
      new: `${ROOTS.ADMIN}/settings/html_add_contents/new`,
      detail: (id: string) => `${ROOTS.ADMIN}/settings/html_add_contents/${id}`,
      edit: (id: string) =>
        `${ROOTS.ADMIN}/settings/html_add_contents/${id}/edit`,
    },
    nationalHoliday: {
      root: `${ROOTS.ADMIN}/settings/national_holidays`,
      new: `${ROOTS.ADMIN}/settings/national_holidays/new`,
      detail: (id: string) => `${ROOTS.ADMIN}/settings/national_holidays/${id}`,
      edit: (id: string) =>
        `${ROOTS.ADMIN}/settings/national_holidays/${id}/edit`,
    },
    adKeyword: {
      root: `${ROOTS.ADMIN}/settings/ad_keywords`,
      new: `${ROOTS.ADMIN}/settings/ad_keywords/new`,
      detail: (id: string) => `${ROOTS.ADMIN}/settings/ad_keywords/${id}`,
      edit: (id: string) => `${ROOTS.ADMIN}/settings/ad_keywords/${id}/edit`,
    },
    customLp: {
      root: `${ROOTS.ADMIN}/settings/custom_lps`,
      new: `${ROOTS.ADMIN}/settings/custom_lps/new`,
      detail: (id: string) => `${ROOTS.ADMIN}/settings/custom_lps/${id}`,
      edit: (id: string) => `${ROOTS.ADMIN}/settings/custom_lps/${id}/edit`,
    },
  },
};
