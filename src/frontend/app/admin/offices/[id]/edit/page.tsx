import { OfficeEditView } from "@/sections/office/view";

// ----------------------------------------------------------------------

export const metadata = {
  title: "事業所編集",
};

type Props = {
  params: {
    id: string;
  };
};

export default function OfficeEditPage({ params }: Props) {
  const { id } = params;

  return <OfficeEditView id={id} />;
}
