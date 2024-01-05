import { ArticleCategoryEditView } from "@/sections/article-category/view";

// ----------------------------------------------------------------------

export const metadata = {
  title: "特集記事カテゴリ編集",
};

type Props = {
  params: {
    id: string;
  };
};

export default function ArticleCategoryEditPage({ params }: Props) {
  const { id } = params;

  return <ArticleCategoryEditView id={id} />;
}
