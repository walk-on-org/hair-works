import { JobEditView } from "@/sections/job/view";

// ----------------------------------------------------------------------

export const metadata = {
  title: "求人編集",
};

type Props = {
  params: {
    id: string;
  };
};

export default function JobEditPage({ params }: Props) {
  const { id } = params;

  return <JobEditView id={id} />;
}
