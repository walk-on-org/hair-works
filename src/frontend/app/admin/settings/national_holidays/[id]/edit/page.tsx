import axios, { endpoints } from "@/utils/axios";
import { NationalHolidayEditView } from "@/sections/national-holiday/view";

// ----------------------------------------------------------------------

export const metadata = {
  title: "祝日マスタ編集",
};

type Props = {
  params: {
    id: string;
  };
};

export default function NationalHolidayEditPage({ params }: Props) {
  const { id } = params;

  return <NationalHolidayEditView id={id} />;
}

/*export async function generateStaticParams() {
  const res = await axios.get(endpoints.jobCategory.list);

  return res.data.jobCategories.map((jobCategory: { id: string }) => ({
    id: jobCategory.id,
  }));
}
*/
