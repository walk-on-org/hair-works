import axios, { endpoints } from "@/utils/axios";
import { HtmlAddContentEditView } from "@/sections/html-add-content/view";

// ----------------------------------------------------------------------

export const metadata = {
  title: "HTML追加コンテンツ編集",
};

type Props = {
  params: {
    id: string;
  };
};

export default function HtmlAddContentEditPage({ params }: Props) {
  const { id } = params;

  return <HtmlAddContentEditView id={id} />;
}

/*export async function generateStaticParams() {
  const res = await axios.get(endpoints.jobCategory.list);

  return res.data.jobCategories.map((jobCategory: { id: string }) => ({
    id: jobCategory.id,
  }));
}
*/
