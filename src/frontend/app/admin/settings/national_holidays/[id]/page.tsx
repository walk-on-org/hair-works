import axios, { endpoints } from "@/utils/axios";
import { NationalHolidayDetailView } from "@/sections/national-holiday/view";

// ----------------------------------------------------------------------

export const metadata = {
  title: "祝日マスタ詳細",
};

type Props = {
  params: {
    id: string;
  };
};

export default function NationalHolidayDetailPage({ params }: Props) {
  const { id } = params;

  return <NationalHolidayDetailView id={id} />;
}

/*export async function generateStaticParams() {
  const res = await axios.get(endpoints.jobCategory.list);

  return res.data.jobCategories.map((jobCategory: { id: string }) => ({
    id: jobCategory.id,
  }));
}
*/
