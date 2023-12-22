export type IArticleItem = {
  id: string;
  title: string;
  description: string;
  article_category_id: string;
  article_category_name: string;
  permalink: string;
  status: string;
  status_name: string;
  main_image: string;
  content: string;
  add_cta: string;
  add_cta_name: string;
  commitment_term_id: string;
  commitment_term_name: string;
  position_id: string;
  position_name: string;
  m_salary_lower: number | null;
  created_at: Date;
  updated_at: Date;
};

export type IArticleTableFilterValue = string | string[];

export type IArticleTableFilters = {
  title: string;
  article_category: string[];
  status: string[];
};
