import { CorporationDetailView } from "@/sections/corporation/view";

// ----------------------------------------------------------------------

export const metadata = {
  title: "法人詳細",
};

type Props = {
  params: {
    id: string;
  };
};

export default function CorporationDetailPage({ params }: Props) {
  const { id } = params;

  return <CorporationDetailView id={id} />;
}
