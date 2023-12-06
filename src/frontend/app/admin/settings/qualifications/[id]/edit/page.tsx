import axios, { endpoints } from "@/utils/axios";
import { QualificationEditView } from "@/sections/qualification/view";

// ----------------------------------------------------------------------

export const metadata = {
  title: "保有資格マスタ編集",
};

type Props = {
  params: {
    id: string;
  };
};

export default function QualificationEditPage({ params }: Props) {
  const { id } = params;

  return <QualificationEditView id={id} />;
}

/*export async function generateStaticParams() {
  const res = await axios.get(endpoints.jobCategory.list);

  return res.data.jobCategories.map((jobCategory: { id: string }) => ({
    id: jobCategory.id,
  }));
}
*/
