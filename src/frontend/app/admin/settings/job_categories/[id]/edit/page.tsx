import axios, { endpoints } from "@/utils/axios";
import { JobCategoryEditView } from "@/sections/job-category/view";

// ----------------------------------------------------------------------

export const metadata = {
  title: "職種マスタ編集",
};

type Props = {
  params: {
    id: string;
  };
};

export default function JobCategoryEditPage({ params }: Props) {
  const { id } = params;

  return <JobCategoryEditView id={id} />;
}

/*export async function generateStaticParams() {
  const res = await axios.get(endpoints.jobCategory.list);

  return res.data.jobCategories.map((jobCategory: { id: string }) => ({
    id: jobCategory.id,
  }));
}
*/
