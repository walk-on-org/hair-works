export type IAdKeywordItem = {
  id: string;
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  keyword_id: string;
  ad_group: string;
  keyword: string;
  match_type: string;
  match_type_name: string;
  createdAt: Date;
  updatedAt: Date;
};

export type IAdKeywordTableFilterValue = string;

export type IAdKeywordTableFilters = {
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  keywordId: string;
  adGroup: string;
  keyword: string;
};
