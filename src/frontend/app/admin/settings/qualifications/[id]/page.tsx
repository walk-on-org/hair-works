import axios, { endpoints } from "@/utils/axios";
import { QualificationDetailView } from "@/sections/qualification/view";

// ----------------------------------------------------------------------

export const metadata = {
  title: "保有資格マスタ詳細",
};

type Props = {
  params: {
    id: string;
  };
};

export default function QualificationDetailPage({ params }: Props) {
  const { id } = params;

  return <QualificationDetailView id={id} />;
}

/*export async function generateStaticParams() {
  const res = await axios.get(endpoints.jobCategory.list);

  return res.data.jobCategories.map((jobCategory: { id: string }) => ({
    id: jobCategory.id,
  }));
}
*/
