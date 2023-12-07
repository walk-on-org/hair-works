import axios, { endpoints } from "@/utils/axios";
import { HtmlAddContentDetailView } from "@/sections/html-add-content/view";

// ----------------------------------------------------------------------

export const metadata = {
  title: "HTML追加コンテンツ詳細",
};

type Props = {
  params: {
    id: string;
  };
};

export default function HtmlAddContentDetailPage({ params }: Props) {
  const { id } = params;

  return <HtmlAddContentDetailView id={id} />;
}

/*export async function generateStaticParams() {
  const res = await axios.get(endpoints.jobCategory.list);

  return res.data.jobCategories.map((jobCategory: { id: string }) => ({
    id: jobCategory.id,
  }));
}
*/
