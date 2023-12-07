import axios, { endpoints } from "@/utils/axios";
import { AdKeywordEditView } from "@/sections/ad-keyword/view";

// ----------------------------------------------------------------------

export const metadata = {
  title: "広告キーワードマスタ編集",
};

type Props = {
  params: {
    id: string;
  };
};

export default function AdKeywordEditPage({ params }: Props) {
  const { id } = params;

  return <AdKeywordEditView id={id} />;
}

/*export async function generateStaticParams() {
  const res = await axios.get(endpoints.jobCategory.list);

  return res.data.jobCategories.map((jobCategory: { id: string }) => ({
    id: jobCategory.id,
  }));
}
*/
