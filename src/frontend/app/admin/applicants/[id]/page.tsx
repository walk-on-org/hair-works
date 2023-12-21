import { ApplicantDetailView } from "@/sections/applicant/view";

// ----------------------------------------------------------------------

export const metadata = {
  title: "応募者詳細",
};

type Props = {
  params: {
    id: string;
  };
};

export default function ApplicantDetailPage({ params }: Props) {
  const { id } = params;

  return <ApplicantDetailView id={id} />;
}
