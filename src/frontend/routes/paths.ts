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
    corporations: `${ROOTS.ADMIN}/corporations`,
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
  },
};
