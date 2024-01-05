import { ArticleDetailView } from "@/sections/article/view";

// ----------------------------------------------------------------------

export const metadata = {
  title: "特集記事詳細",
};

type Props = {
  params: {
    id: string;
  };
};

export default function ArticleDetailPage({ params }: Props) {
  const { id } = params;

  return <ArticleDetailView id={id} />;
}
