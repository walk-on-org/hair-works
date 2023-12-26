import { MailmagazineConfigEditView } from "@/sections/mailmagazine-config/view";

// ----------------------------------------------------------------------

export const metadata = {
  title: "メルマガ設定編集",
};

type Props = {
  params: {
    id: string;
  };
};

export default function MailmagazineConfigEditPage({ params }: Props) {
  const { id } = params;

  return <MailmagazineConfigEditView id={id} />;
}
