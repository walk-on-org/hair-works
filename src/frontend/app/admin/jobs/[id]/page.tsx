import { JobDetailView } from "@/sections/job/view";

// ----------------------------------------------------------------------

export const metadata = {
  title: "求人詳細",
};

type Props = {
  params: {
    id: string;
  };
};

export default function JobDetailPage({ params }: Props) {
  const { id } = params;

  return <JobDetailView id={id} />;
}
