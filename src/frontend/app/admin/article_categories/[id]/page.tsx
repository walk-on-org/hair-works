import { ArticleCategoryDetailView } from "@/sections/article-category/view";

// ----------------------------------------------------------------------

export const metadata = {
  title: "特集記事カテゴリ詳細",
};

type Props = {
  params: {
    id: string;
  };
};

export default function ArticleCategoryDetailPage({ params }: Props) {
  const { id } = params;

  return <ArticleCategoryDetailView id={id} />;
}
