import axios, { endpoints } from "@/utils/axios";
import { LineDetailView } from "@/sections/line/view";

// ----------------------------------------------------------------------

export const metadata = {
  title: "路線マスタ詳細",
};

type Props = {
  params: {
    id: string;
  };
};

export default function LineDetailPage({ params }: Props) {
  const { id } = params;

  return <LineDetailView id={id} />;
}

/*export async function generateStaticParams() {
  const res = await axios.get(endpoints.jobCategory.list);

  return res.data.jobCategories.map((jobCategory: { id: string }) => ({
    id: jobCategory.id,
  }));
}
*/
