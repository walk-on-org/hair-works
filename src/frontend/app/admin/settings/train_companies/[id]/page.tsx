import axios, { endpoints } from "@/utils/axios";
import { TrainCompanyDetailView } from "@/sections/train-company/view";

// ----------------------------------------------------------------------

export const metadata = {
  title: "鉄道事業者マスタ詳細",
};

type Props = {
  params: {
    id: string;
  };
};

export default function TrainCompanyDetailPage({ params }: Props) {
  const { id } = params;

  return <TrainCompanyDetailView id={id} />;
}

/*export async function generateStaticParams() {
  const res = await axios.get(endpoints.jobCategory.list);

  return res.data.jobCategories.map((jobCategory: { id: string }) => ({
    id: jobCategory.id,
  }));
}
*/
