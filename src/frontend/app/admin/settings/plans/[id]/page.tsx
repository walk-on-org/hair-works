import axios, { endpoints } from "@/utils/axios";
import { PlanDetailView } from "@/sections/plan/view";

// ----------------------------------------------------------------------

export const metadata = {
  title: "プランマスタ詳細",
};

type Props = {
  params: {
    id: string;
  };
};

export default function PlanDetailPage({ params }: Props) {
  const { id } = params;

  return <PlanDetailView id={id} />;
}

/*export async function generateStaticParams() {
  const res = await axios.get(endpoints.jobCategory.list);

  return res.data.jobCategories.map((jobCategory: { id: string }) => ({
    id: jobCategory.id,
  }));
}
*/
