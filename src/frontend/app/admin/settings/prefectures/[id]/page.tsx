import axios, { endpoints } from "@/utils/axios";
import { PrefectureDetailView } from "@/sections/prefecture/view";

// ----------------------------------------------------------------------

export const metadata = {
  title: "都道府県マスタ詳細",
};

type Props = {
  params: {
    id: string;
  };
};

export default function PrefectureDetailPage({ params }: Props) {
  const { id } = params;

  return <PrefectureDetailView id={id} />;
}

/*export async function generateStaticParams() {
  const res = await axios.get(endpoints.jobCategory.list);

  return res.data.jobCategories.map((jobCategory: { id: string }) => ({
    id: jobCategory.id,
  }));
}
*/
