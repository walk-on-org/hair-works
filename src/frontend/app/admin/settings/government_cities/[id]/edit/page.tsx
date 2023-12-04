import axios, { endpoints } from "@/utils/axios";
import { GovernmentCityEditView } from "@/sections/government-city/view";

// ----------------------------------------------------------------------

export const metadata = {
  title: "政令指定都市マスタ編集",
};

type Props = {
  params: {
    id: string;
  };
};

export default function GovernmentCityEditPage({ params }: Props) {
  const { id } = params;

  return <GovernmentCityEditView id={id} />;
}

/*export async function generateStaticParams() {
  const res = await axios.get(endpoints.jobCategory.list);

  return res.data.jobCategories.map((jobCategory: { id: string }) => ({
    id: jobCategory.id,
  }));
}
*/
