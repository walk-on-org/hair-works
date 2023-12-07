import { useMemo } from "react";

import { paths } from "@/routes/paths";

import Label from "@/components/label";
import Iconify from "@/components/iconify";
import SvgColor from "@/components/svg-color";

// ----------------------------------------------------------------------

const icon = (name: string) => (
  <SvgColor
    src={`/assets/icons/navbar/${name}.svg`}
    sx={{ width: 1, height: 1 }}
  />
  // OR
  // <Iconify icon="fluent:mail-24-filled" />
  // https://icon-sets.iconify.design/solar/
  // https://www.streamlinehq.com/icons
);

const ICONS = {
  job: icon("ic_job"),
  blog: icon("ic_blog"),
  chat: icon("ic_chat"),
  mail: icon("ic_mail"),
  user: icon("ic_user"),
  file: icon("ic_file"),
  lock: icon("ic_lock"),
  tour: icon("ic_tour"),
  order: icon("ic_order"),
  label: icon("ic_label"),
  blank: icon("ic_blank"),
  kanban: icon("ic_kanban"),
  folder: icon("ic_folder"),
  banking: icon("ic_banking"),
  booking: icon("ic_booking"),
  invoice: icon("ic_invoice"),
  product: icon("ic_product"),
  calendar: icon("ic_calendar"),
  disabled: icon("ic_disabled"),
  external: icon("ic_external"),
  menuItem: icon("ic_menu_item"),
  ecommerce: icon("ic_ecommerce"),
  analytics: icon("ic_analytics"),
  dashboard: icon("ic_dashboard"),
};

// ----------------------------------------------------------------------

export function useNavData() {
  const data = useMemo(
    () => [
      // OVERVIEW
      // ----------------------------------------------------------------------
      {
        subheader: "overview",
        items: [
          {
            title: "ダッシュボード",
            path: paths.admin.dashboard,
            icon: ICONS.dashboard,
          },
          {
            title: "法人",
            path: paths.admin.corporations,
            icon: ICONS.ecommerce,
          },
        ],
      },

      // マスタ設定
      // ----------------------------------------------------------------------
      {
        subheader: "マスタ設定",
        items: [
          // 職種
          {
            title: "職種",
            path: paths.admin.jobCategory.root,
          },
          // 役職/役割
          {
            title: "役職/役割",
            path: paths.admin.position.root,
          },
          // 雇用形態
          {
            title: "雇用形態",
            path: paths.admin.employment.root,
          },
          // 都道府県
          {
            title: "都道府県",
            path: paths.admin.prefecture.root,
          },
          // 政令指定都市
          {
            title: "政令指定都市",
            path: paths.admin.governmentCity.root,
          },
          // 市区町村
          {
            title: "市区町村",
            path: paths.admin.city.root,
          },
          // 鉄道事業者
          {
            title: "鉄道事業者",
            path: paths.admin.trainCompany.root,
          },
          // 路線
          {
            title: "路線",
            path: paths.admin.line.root,
          },
          // 駅
          {
            title: "駅",
            path: paths.admin.station.root,
          },
          // 休日
          {
            title: "休日",
            path: paths.admin.holiday.root,
          },
          // こだわり条件
          {
            title: "こだわり条件",
            path: paths.admin.commitmentTerm.root,
          },
          // 保有資格
          {
            title: "保有資格",
            path: paths.admin.qualification.root,
          },
          // LP職種
          {
            title: "LP職種",
            path: paths.admin.lpJobCategory.root,
          },
          // プラン
          {
            title: "プラン",
            path: paths.admin.plan.root,
          },
          // HTML追加コンテンツ
          {
            title: "HTML追加コンテンツ",
            path: paths.admin.htmlAddContent.root,
            icon: ICONS.file,
          },
          // 祝日
          {
            title: "祝日",
            path: paths.admin.nationalHoliday.root,
          },
          // 広告キーワード
          {
            title: "広告キーワード",
            path: paths.admin.adKeyword.root,
          },
          // 専用LP設定
          {
            title: "専用LP設定",
            path: paths.admin.customLp.root,
          },
        ],
      },
    ],
    []
  );

  return data;
}
