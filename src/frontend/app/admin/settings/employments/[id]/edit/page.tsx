import axios, { endpoints } from "@/utils/axios";
import { EmploymentEditView } from "@/sections/employment/view";

// ----------------------------------------------------------------------

export const metadata = {
  title: "雇用形態マスタ編集",
};

type Props = {
  params: {
    id: string;
  };
};

export default function EmploymentEditPage({ params }: Props) {
  const { id } = params;

  return <EmploymentEditView id={id} />;
}

/*export async function generateStaticParams() {
  const res = await axios.get(endpoints.jobCategory.list);

  return res.data.jobCategories.map((jobCategory: { id: string }) => ({
    id: jobCategory.id,
  }));
}
*/
