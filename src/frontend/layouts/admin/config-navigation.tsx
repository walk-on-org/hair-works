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
            path: paths.admin.corporation.root,
            icon: ICONS.ecommerce,
          },
          {
            title: "事業所",
            path: paths.admin.office.root,
            icon: ICONS.ecommerce,
          },
          {
            title: "求人",
            path: paths.admin.job.root,
            icon: ICONS.job,
          },
          {
            title: "会員情報",
            path: paths.admin.member.root,
            icon: ICONS.user,
          },
          {
            title: "応募者",
            path: paths.admin.applicant.root,
            icon: ICONS.user,
          },
          {
            title: "問い合わせ",
            path: paths.admin.inquiry.root,
            icon: ICONS.external,
          },
          {
            title: "特集",
            path: "#",
            icon: ICONS.blog,
            children: [
              {
                title: "カテゴリ",
                path: paths.admin.articleCategory.root,
              },
            ],
          },
          {
            title: "マスタ設定",
            path: "#",
            icon: ICONS.menuItem,
            children: [
              {
                title: "職種",
                path: paths.admin.jobCategory.root,
              },
              {
                title: "役職/役割",
                path: paths.admin.position.root,
              },
              {
                title: "雇用形態",
                path: paths.admin.employment.root,
              },
              {
                title: "都道府県",
                path: paths.admin.prefecture.root,
              },
              {
                title: "政令指定都市",
                path: paths.admin.governmentCity.root,
              },
              {
                title: "市区町村",
                path: paths.admin.city.root,
              },
              {
                title: "鉄道事業者",
                path: paths.admin.trainCompany.root,
              },
              {
                title: "路線",
                path: paths.admin.line.root,
              },
              {
                title: "駅",
                path: paths.admin.station.root,
              },
              {
                title: "休日",
                path: paths.admin.holiday.root,
              },
              {
                title: "こだわり条件",
                path: paths.admin.commitmentTerm.root,
              },
              {
                title: "保有資格",
                path: paths.admin.qualification.root,
              },
              {
                title: "LP職種",
                path: paths.admin.lpJobCategory.root,
              },
              {
                title: "プラン",
                path: paths.admin.plan.root,
              },
              {
                title: "HTML追加コンテンツ",
                path: paths.admin.htmlAddContent.root,
              },
              {
                title: "祝日",
                path: paths.admin.nationalHoliday.root,
              },
              {
                title: "広告キーワード",
                path: paths.admin.adKeyword.root,
              },
              {
                title: "専用LP設定",
                path: paths.admin.customLp.root,
              },
            ],
          },
        ],
      },
    ],
    []
  );

  return data;
}
