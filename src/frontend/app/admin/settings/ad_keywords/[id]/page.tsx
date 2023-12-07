import axios, { endpoints } from "@/utils/axios";
import { AdKeywordDetailView } from "@/sections/ad-keyword/view";

// ----------------------------------------------------------------------

export const metadata = {
  title: "広告キーワードマスタ詳細",
};

type Props = {
  params: {
    id: string;
  };
};

export default function AdKeywordDetailPage({ params }: Props) {
  const { id } = params;

  return <AdKeywordDetailView id={id} />;
}

/*export async function generateStaticParams() {
  const res = await axios.get(endpoints.jobCategory.list);

  return res.data.jobCategories.map((jobCategory: { id: string }) => ({
    id: jobCategory.id,
  }));
}
*/
