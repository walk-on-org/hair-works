import axios, { endpoints } from "@/utils/axios";
import { PrefectureEditView } from "@/sections/prefecture/view";

// ----------------------------------------------------------------------

export const metadata = {
  title: "都道府県マスタ編集",
};

type Props = {
  params: {
    id: string;
  };
};

export default function PrefectureEditPage({ params }: Props) {
  const { id } = params;

  return <PrefectureEditView id={id} />;
}

/*export async function generateStaticParams() {
  const res = await axios.get(endpoints.jobCategory.list);

  return res.data.jobCategories.map((jobCategory: { id: string }) => ({
    id: jobCategory.id,
  }));
}
*/
