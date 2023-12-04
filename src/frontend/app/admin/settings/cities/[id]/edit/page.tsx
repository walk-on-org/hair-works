import axios, { endpoints } from "@/utils/axios";
import { CityEditView } from "@/sections/city/view";

// ----------------------------------------------------------------------

export const metadata = {
  title: "市区町村マスタ編集",
};

type Props = {
  params: {
    id: string;
  };
};

export default function CityEditPage({ params }: Props) {
  const { id } = params;

  return <CityEditView id={id} />;
}

/*export async function generateStaticParams() {
  const res = await axios.get(endpoints.jobCategory.list);

  return res.data.jobCategories.map((jobCategory: { id: string }) => ({
    id: jobCategory.id,
  }));
}
*/
