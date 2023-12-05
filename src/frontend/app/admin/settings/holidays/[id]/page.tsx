import axios, { endpoints } from "@/utils/axios";
import { HolidayDetailView } from "@/sections/holiday/view";

// ----------------------------------------------------------------------

export const metadata = {
  title: "休日マスタ詳細",
};

type Props = {
  params: {
    id: string;
  };
};

export default function HolidayDetailPage({ params }: Props) {
  const { id } = params;

  return <HolidayDetailView id={id} />;
}

/*export async function generateStaticParams() {
  const res = await axios.get(endpoints.jobCategory.list);

  return res.data.jobCategories.map((jobCategory: { id: string }) => ({
    id: jobCategory.id,
  }));
}
*/
