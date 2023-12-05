import axios, { endpoints } from "@/utils/axios";
import { HolidayEditView } from "@/sections/holiday/view";

// ----------------------------------------------------------------------

export const metadata = {
  title: "休日マスタ編集",
};

type Props = {
  params: {
    id: string;
  };
};

export default function HolidayEditPage({ params }: Props) {
  const { id } = params;

  return <HolidayEditView id={id} />;
}

/*export async function generateStaticParams() {
  const res = await axios.get(endpoints.jobCategory.list);

  return res.data.jobCategories.map((jobCategory: { id: string }) => ({
    id: jobCategory.id,
  }));
}
*/
