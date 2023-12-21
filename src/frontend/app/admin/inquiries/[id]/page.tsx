import { InquiryDetailView } from "@/sections/inquiry/view";

// ----------------------------------------------------------------------

export const metadata = {
  title: "問い合わせ詳細",
};

type Props = {
  params: {
    id: string;
  };
};

export default function InquiryDetailPage({ params }: Props) {
  const { id } = params;

  return <InquiryDetailView id={id} />;
}
