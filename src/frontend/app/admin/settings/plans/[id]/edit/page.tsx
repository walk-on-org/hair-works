import axios, { endpoints } from "@/utils/axios";
import { PlanEditView } from "@/sections/plan/view";

// ----------------------------------------------------------------------

export const metadata = {
  title: "プランマスタ編集",
};

type Props = {
  params: {
    id: string;
  };
};

export default function PlanEditPage({ params }: Props) {
  const { id } = params;

  return <PlanEditView id={id} />;
}

/*export async function generateStaticParams() {
  const res = await axios.get(endpoints.jobCategory.list);

  return res.data.jobCategories.map((jobCategory: { id: string }) => ({
    id: jobCategory.id,
  }));
}
*/
