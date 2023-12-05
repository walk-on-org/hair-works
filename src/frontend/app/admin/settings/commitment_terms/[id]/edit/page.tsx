import axios, { endpoints } from "@/utils/axios";
import { CommitmentTermEditView } from "@/sections/commitment-term/view";

// ----------------------------------------------------------------------

export const metadata = {
  title: "こだわり条件マスタ編集",
};

type Props = {
  params: {
    id: string;
  };
};

export default function CommitmentTermEditPage({ params }: Props) {
  const { id } = params;

  return <CommitmentTermEditView id={id} />;
}

/*export async function generateStaticParams() {
  const res = await axios.get(endpoints.jobCategory.list);

  return res.data.jobCategories.map((jobCategory: { id: string }) => ({
    id: jobCategory.id,
  }));
}
*/
