import axios, { endpoints } from "@/utils/axios";
import { LpJobCategoryDetailView } from "@/sections/lp-job-category/view";

// ----------------------------------------------------------------------

export const metadata = {
  title: "LP職種マスタ詳細",
};

type Props = {
  params: {
    id: string;
  };
};

export default function LpJobCategoryDetailPage({ params }: Props) {
  const { id } = params;

  return <LpJobCategoryDetailView id={id} />;
}

/*export async function generateStaticParams() {
  const res = await axios.get(endpoints.jobCategory.list);

  return res.data.jobCategories.map((jobCategory: { id: string }) => ({
    id: jobCategory.id,
  }));
}
*/
