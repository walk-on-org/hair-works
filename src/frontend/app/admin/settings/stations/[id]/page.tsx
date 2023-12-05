import axios, { endpoints } from "@/utils/axios";
import { StationDetailView } from "@/sections/station/view";

// ----------------------------------------------------------------------

export const metadata = {
  title: "駅マスタ詳細",
};

type Props = {
  params: {
    id: string;
  };
};

export default function StationDetailPage({ params }: Props) {
  const { id } = params;

  return <StationDetailView id={id} />;
}

/*export async function generateStaticParams() {
  const res = await axios.get(endpoints.jobCategory.list);

  return res.data.jobCategories.map((jobCategory: { id: string }) => ({
    id: jobCategory.id,
  }));
}
*/
