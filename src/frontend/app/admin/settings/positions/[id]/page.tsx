import axios, { endpoints } from "@/utils/axios";
import { PositionDetailView } from "@/sections/position/view";

// ----------------------------------------------------------------------

export const metadata = {
  title: "役職/役割マスタ詳細",
};

type Props = {
  params: {
    id: string;
  };
};

export default function PositionDetailPage({ params }: Props) {
  const { id } = params;

  return <PositionDetailView id={id} />;
}

/*export async function generateStaticParams() {
  const res = await axios.get(endpoints.jobCategory.list);

  return res.data.jobCategories.map((jobCategory: { id: string }) => ({
    id: jobCategory.id,
  }));
}
*/
