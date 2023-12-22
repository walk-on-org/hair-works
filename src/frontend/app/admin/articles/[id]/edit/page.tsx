import { ArticleEditView } from "@/sections/article/view";

// ----------------------------------------------------------------------

export const metadata = {
  title: "特集記事編集",
};

type Props = {
  params: {
    id: string;
  };
};

export default function ArticleEditPage({ params }: Props) {
  const { id } = params;

  return <ArticleEditView id={id} />;
}
