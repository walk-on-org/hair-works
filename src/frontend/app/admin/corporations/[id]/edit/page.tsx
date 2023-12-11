import { CorporationEditView } from "@/sections/corporation/view";

// ----------------------------------------------------------------------

export const metadata = {
  title: "法人編集",
};

type Props = {
  params: {
    id: string;
  };
};

export default function CorporationEditPage({ params }: Props) {
  const { id } = params;

  return <CorporationEditView id={id} />;
}
