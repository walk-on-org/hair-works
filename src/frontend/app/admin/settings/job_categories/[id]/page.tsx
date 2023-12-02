import axios, { endpoints } from "@/utils/axios";
import { JobCategoryDetailView } from "@/sections/job-category/view";

// ----------------------------------------------------------------------

export const metadata = {
  title: "職種マスタ詳細",
};

type Props = {
  params: {
    id: string;
  };
};

export default function JobCategoryDetailPage({ params }: Props) {
  const { id } = params;

  return <JobCategoryDetailView id={id} />;
}

/*export async function generateStaticParams() {
  const res = await axios.get(endpoints.jobCategory.list);

  return res.data.jobCategories.map((jobCategory: { id: string }) => ({
    id: jobCategory.id,
  }));
}
*/
