import { OfficeDetailView } from "@/sections/office/view";

// ----------------------------------------------------------------------

export const metadata = {
  title: "事業所詳細",
};

type Props = {
  params: {
    id: string;
  };
};

export default function OfficeDetailPage({ params }: Props) {
  const { id } = params;

  return <OfficeDetailView id={id} />;
}
