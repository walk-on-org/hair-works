import axios, { endpoints } from "@/utils/axios";
import { CityDetailView } from "@/sections/city/view";

// ----------------------------------------------------------------------

export const metadata = {
  title: "市区町村マスタ詳細",
};

type Props = {
  params: {
    id: string;
  };
};

export default function CityDetailPage({ params }: Props) {
  const { id } = params;

  return <CityDetailView id={id} />;
}

/*export async function generateStaticParams() {
  const res = await axios.get(endpoints.jobCategory.list);

  return res.data.jobCategories.map((jobCategory: { id: string }) => ({
    id: jobCategory.id,
  }));
}
*/
