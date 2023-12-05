import axios, { endpoints } from "@/utils/axios";
import { StationEditView } from "@/sections/station/view";

// ----------------------------------------------------------------------

export const metadata = {
  title: "駅マスタ編集",
};

type Props = {
  params: {
    id: string;
  };
};

export default function StationEditPage({ params }: Props) {
  const { id } = params;

  return <StationEditView id={id} />;
}

/*export async function generateStaticParams() {
  const res = await axios.get(endpoints.jobCategory.list);

  return res.data.jobCategories.map((jobCategory: { id: string }) => ({
    id: jobCategory.id,
  }));
}
*/
