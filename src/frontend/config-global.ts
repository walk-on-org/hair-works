export const STATUS_OPTIONS = [
  { value: "1", label: "有効" },
  { value: "0", label: "無効" },
];

export const TRAIN_STATUS_OPTIONS = [
  { value: "0", label: "運用中" },
  { value: "1", label: "運用前" },
  { value: "2", label: "廃止" },
];

export const ARTICLE_STATUS_OPTIONS = [
  { value: "0", label: "準備中" },
  { value: "1", label: "公開中" },
  { value: "2", label: "停止中" },
];

export const REGION_OPTIONS = [
  { value: "1", label: "北海道・東北" },
  { value: "2", label: "関東" },
  { value: "3", label: "甲信越・北陸" },
  { value: "4", label: "東海" },
  { value: "5", label: "関西" },
  { value: "6", label: "中国" },
  { value: "7", label: "四国" },
  { value: "8", label: "九州・沖縄" },
];

export const COMMITMENT_TERM_CATEGORY = [
  { value: "1", label: "待遇・条件" },
  { value: "2", label: "教育・研修" },
  { value: "3", label: "経験・資格" },
  { value: "4", label: "店舗の特徴" },
  { value: "5", label: "在籍スタッフ" },
];

export const AD_KEYWORD_MATCH_TYPE = [
  { value: "1", label: "部分一致" },
  { value: "2", label: "フレーズ一致" },
  { value: "3", label: "完全一致" },
];

export const PASSIVE_SMOKING = [
  { value: "1", label: "屋内禁煙（屋外に喫煙場所設置あり）" },
  { value: "2", label: "敷地内禁煙" },
  { value: "3", label: "受動喫煙対策あり（敷地内完全禁煙）" },
  { value: "4", label: "全面禁煙" },
];

export const MOVE_TYPE = [
  { value: "1", label: "徒歩" },
  { value: "2", label: "車" },
  { value: "3", label: "バス" },
];

export const CLIENTELE = [
  { value: "1", label: "20代中心" },
  { value: "2", label: "30代中心" },
  { value: "3", label: "40代以降中心" },
  { value: "9", label: "ALL年代" },
  { value: "99", label: "その他" },
];

export const JOB_STATUS_OPTIONS = [
  { value: "0", label: "掲載準備中" },
  { value: "5", label: "掲載承認待ち" },
  { value: "9", label: "掲載承認済" },
  { value: "10", label: "掲載中" },
  { value: "20", label: "掲載停止" },
];

export const CHANGE_TIME_OPTIONS = [
  { value: "0", label: "1ヶ月以内" },
  { value: "1", label: "3ヶ月以内" },
  { value: "2", label: "6ヶ月以内" },
  { value: "3", label: "12ヶ月以内" },
  { value: "4", label: "新卒での就職希望" },
  { value: "5", label: "求人が見たいだけ" },
];

export const RETIREMENT_TIME_OPTIONS = [
  { value: "0", label: "離職中/退職確定済み" },
  { value: "1", label: "すぐに辞めたい" },
  { value: "2", label: "良い転職先があれば辞めたい" },
  { value: "3", label: "まだ辞められるとは決められない" },
  { value: "4", label: "在学中(今年度卒業予定)" },
  { value: "5", label: "在学中(来年度以降卒業予定)" },
];

export const REGISTER_SITE_OPTIONS = [
  { value: "1", label: "ヘアワークス" },
  { value: "2", label: "ヘアワークスエージェント" },
];

export const REGISTER_FORM_OPTIONS = [
  { value: "1", label: "会員登録フォーム" },
  { value: "2", label: "応募フォーム" },
  { value: "3", label: "お友達紹介フォーム" },
];

export const MEMBER_STATUS_OPTIONS = [
  { value: "0", label: "未対応" },
  { value: "1", label: "連絡不通" },
  { value: "2", label: "辞退" },
  { value: "3", label: "連絡済" },
  { value: "20", label: "面談済" },
  { value: "19", label: "追客中" },
  { value: "9", label: "応募済" },
  { value: "14", label: "日程調整中" },
  { value: "16", label: "見学設定済" },
  { value: "13", label: "面接設定済" },
  { value: "4", label: "面接済" },
  { value: "11", label: "追客中" },
  { value: "5", label: "内定" },
  { value: "6", label: "入社済" },
  { value: "7", label: "該当求人なし" },
  { value: "8", label: "番号他人" },
  { value: "10", label: "重複" },
  { value: "12", label: "登録解除" },
  { value: "15", label: "時期先" },
  { value: "17", label: "リリース（コンタクト有）" },
  { value: "18", label: "リリース（コンタクト無）" },
];

export const INTRODUCTION_GIFT_STATUS_OPTIONS = [
  { value: "1", label: "未確認" },
  { value: "2", label: "紹介者該当あり" },
  { value: "3", label: "登録者通電済み" },
  { value: "4", label: "プレゼント済" },
  { value: "0", label: "【対象外】お友達紹介LP以外" },
  { value: "90", label: "【対象外】紹介者該当なし" },
  { value: "91", label: "【対象外】重複登録" },
];

export const APPLICANT_STATUS_OPTIONS = [
  { value: "0", label: "未対応" },
  { value: "1", label: "連絡不通" },
  { value: "2", label: "辞退" },
  { value: "3", label: "連絡済" },
  { value: "7", label: "見学/面接後NG" },
  { value: "4", label: "面接済" },
  { value: "5", label: "内定" },
  { value: "6", label: "入社済" },
];

export const INQUIRY_STATUS_OPTIONS = [
  { value: "0", label: "未対応" },
  { value: "1", label: "対応済" },
];

export const KEEP_STATUS_OPTIONS = [
  { value: "1", label: "お気に入り済" },
  { value: "2", label: "お気に入り解除" },
];
