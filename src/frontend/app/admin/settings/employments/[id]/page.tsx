import axios, { endpoints } from "@/utils/axios";
import { EmploymentDetailView } from "@/sections/employment/view";

// ----------------------------------------------------------------------

export const metadata = {
  title: "雇用形態マスタ詳細",
};

type Props = {
  params: {
    id: string;
  };
};

export default function EmploymentDetailPage({ params }: Props) {
  const { id } = params;

  return <EmploymentDetailView id={id} />;
}

/*export async function generateStaticParams() {
  const res = await axios.get(endpoints.jobCategory.list);

  return res.data.jobCategories.map((jobCategory: { id: string }) => ({
    id: jobCategory.id,
  }));
}
*/
