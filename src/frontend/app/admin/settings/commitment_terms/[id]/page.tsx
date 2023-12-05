import axios, { endpoints } from "@/utils/axios";
import { CommitmentTermDetailView } from "@/sections/commitment-term/view";

// ----------------------------------------------------------------------

export const metadata = {
  title: "こだわり条件マスタ詳細",
};

type Props = {
  params: {
    id: string;
  };
};

export default function CommitmentTermDetailPage({ params }: Props) {
  const { id } = params;

  return <CommitmentTermDetailView id={id} />;
}

/*export async function generateStaticParams() {
  const res = await axios.get(endpoints.jobCategory.list);

  return res.data.jobCategories.map((jobCategory: { id: string }) => ({
    id: jobCategory.id,
  }));
}
*/
