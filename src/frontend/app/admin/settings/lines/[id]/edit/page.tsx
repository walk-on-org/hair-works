import axios, { endpoints } from "@/utils/axios";
import { LineEditView } from "@/sections/line/view";

// ----------------------------------------------------------------------

export const metadata = {
  title: "路線マスタ編集",
};

type Props = {
  params: {
    id: string;
  };
};

export default function LineEditPage({ params }: Props) {
  const { id } = params;

  return <LineEditView id={id} />;
}

/*export async function generateStaticParams() {
  const res = await axios.get(endpoints.jobCategory.list);

  return res.data.jobCategories.map((jobCategory: { id: string }) => ({
    id: jobCategory.id,
  }));
}
*/
