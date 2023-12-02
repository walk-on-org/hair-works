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
};
