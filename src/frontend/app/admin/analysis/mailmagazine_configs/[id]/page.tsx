import { MailmagazineConfigDetailView } from "@/sections/mailmagazine-config/view";

// ----------------------------------------------------------------------

export const metadata = {
  title: "メルマガ設定詳細",
};

type Props = {
  params: {
    id: string;
  };
};

export default function MailmagazineConfigDetailPage({ params }: Props) {
  const { id } = params;

  return <MailmagazineConfigDetailView id={id} />;
}
