import axios, { endpoints } from "@/utils/axios";
import { CustomLpEditView } from "@/sections/custom-lp/view";

// ----------------------------------------------------------------------

export const metadata = {
  title: "専用LP設定編集",
};

type Props = {
  params: {
    id: string;
  };
};

export default function CustomLpEditPage({ params }: Props) {
  const { id } = params;

  return <CustomLpEditView id={id} />;
}

/*export async function generateStaticParams() {
  const res = await axios.get(endpoints.jobCategory.list);

  return res.data.jobCategories.map((jobCategory: { id: string }) => ({
    id: jobCategory.id,
  }));
}
*/
