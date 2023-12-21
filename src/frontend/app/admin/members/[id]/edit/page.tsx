import { MemberEditView } from "@/sections/member/view";

// ----------------------------------------------------------------------

export const metadata = {
  title: "会員情報編集",
};

type Props = {
  params: {
    id: string;
  };
};

export default function MemberEditPage({ params }: Props) {
  const { id } = params;

  return <MemberEditView id={id} />;
}
