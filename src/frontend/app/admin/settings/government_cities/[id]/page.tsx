import axios, { endpoints } from "@/utils/axios";
import { GovernmentCityDetailView } from "@/sections/government-city/view";

// ----------------------------------------------------------------------

export const metadata = {
  title: "政令指定都市マスタ詳細",
};

type Props = {
  params: {
    id: string;
  };
};

export default function GovernmentCityDetailPage({ params }: Props) {
  const { id } = params;

  return <GovernmentCityDetailView id={id} />;
}

/*export async function generateStaticParams() {
  const res = await axios.get(endpoints.jobCategory.list);

  return res.data.jobCategories.map((jobCategory: { id: string }) => ({
    id: jobCategory.id,
  }));
}
*/
