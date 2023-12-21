import { ApplicantEditView } from "@/sections/applicant/view";

// ----------------------------------------------------------------------

export const metadata = {
  title: "応募者編集",
};

type Props = {
  params: {
    id: string;
  };
};

export default function ApplicantEditPage({ params }: Props) {
  const { id } = params;

  return <ApplicantEditView id={id} />;
}
