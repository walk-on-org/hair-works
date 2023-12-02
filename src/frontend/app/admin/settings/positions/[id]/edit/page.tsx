import axios, { endpoints } from "@/utils/axios";
import { PositionEditView } from "@/sections/position/view";

// ----------------------------------------------------------------------

export const metadata = {
  title: "役職/役割マスタ編集",
};

type Props = {
  params: {
    id: string;
  };
};

export default function PositionEditPage({ params }: Props) {
  const { id } = params;

  return <PositionEditView id={id} />;
}

/*export async function generateStaticParams() {
  const res = await axios.get(endpoints.jobCategory.list);

  return res.data.jobCategories.map((jobCategory: { id: string }) => ({
    id: jobCategory.id,
  }));
}
*/
