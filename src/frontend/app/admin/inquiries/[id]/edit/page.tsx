import { InquiryEditView } from "@/sections/inquiry/view";

// ----------------------------------------------------------------------

export const metadata = {
  title: "問い合わせ編集",
};

type Props = {
  params: {
    id: string;
  };
};

export default function InquiryEditPage({ params }: Props) {
  const { id } = params;

  return <InquiryEditView id={id} />;
}
