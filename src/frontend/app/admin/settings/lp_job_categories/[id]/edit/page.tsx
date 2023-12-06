import axios, { endpoints } from "@/utils/axios";
import { LpJobCategoryEditView } from "@/sections/lp-job-category/view";

// ----------------------------------------------------------------------

export const metadata = {
  title: "LP職種マスタ編集",
};

type Props = {
  params: {
    id: string;
  };
};

export default function LpJobCategoryEditPage({ params }: Props) {
  const { id } = params;

  return <LpJobCategoryEditView id={id} />;
}

/*export async function generateStaticParams() {
  const res = await axios.get(endpoints.jobCategory.list);

  return res.data.jobCategories.map((jobCategory: { id: string }) => ({
    id: jobCategory.id,
  }));
}
*/
