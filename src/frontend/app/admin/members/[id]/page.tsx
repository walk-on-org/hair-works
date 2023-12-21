import { MemberDetailView } from "@/sections/member/view";

// ----------------------------------------------------------------------

export const metadata = {
  title: "会員情報詳細",
};

type Props = {
  params: {
    id: string;
  };
};

export default function MemberDetailPage({ params }: Props) {
  const { id } = params;

  return <MemberDetailView id={id} />;
}
