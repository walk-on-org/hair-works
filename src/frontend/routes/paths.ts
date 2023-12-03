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
  },
};
