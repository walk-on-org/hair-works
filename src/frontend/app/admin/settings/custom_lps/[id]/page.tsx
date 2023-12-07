import axios, { endpoints } from "@/utils/axios";
import { CustomLpDetailView } from "@/sections/custom-lp/view";

// ----------------------------------------------------------------------

export const metadata = {
  title: "専用LP設定詳細",
};

type Props = {
  params: {
    id: string;
  };
};

export default function CustomLpDetailPage({ params }: Props) {
  const { id } = params;

  return <CustomLpDetailView id={id} />;
}

/*export async function generateStaticParams() {
  const res = await axios.get(endpoints.jobCategory.list);

  return res.data.jobCategories.map((jobCategory: { id: string }) => ({
    id: jobCategory.id,
  }));
}
*/
