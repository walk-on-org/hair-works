import { MemberListView } from "@/sections/member/view";

// ----------------------------------------------------------------------

export const metadata = {
  title: "会員情報一覧",
};

export default function MemberListPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  let empPrefecture: string[] = [];
  if (searchParams.emp_prefecture_id) {
    empPrefecture = Array.isArray(searchParams.emp_prefecture_id)
      ? searchParams.emp_prefecture_id
      : searchParams.emp_prefecture_id.split(",");
  }

  let registerSite: string[] = [];
  if (searchParams.register_site) {
    registerSite = Array.isArray(searchParams.register_site)
      ? searchParams.register_site
      : searchParams.register_site.split(",");
  }

  let registerForm: string[] = [];
  if (searchParams.register_form) {
    registerForm = Array.isArray(searchParams.register_form)
      ? searchParams.register_form
      : searchParams.register_form.split(",");
  }

  let introductionGiftStatus: string[] = [];
  if (searchParams.introduction_gift_status) {
    introductionGiftStatus = Array.isArray(
      searchParams.introduction_gift_status
    )
      ? searchParams.introduction_gift_status
      : searchParams.introduction_gift_status.split(",");
  }

  return (
    <MemberListView
      name={searchParams.name ? String(searchParams.name) : ""}
      email={searchParams.email ? String(searchParams.email) : ""}
      phone={searchParams.phone ? String(searchParams.phone) : ""}
      empPrefecture={empPrefecture}
      registerSite={registerSite}
      registerForm={registerForm}
      introductionGiftStatus={introductionGiftStatus}
      page={searchParams.page ? Number(searchParams.page) : 1}
      limit={searchParams.limit ? Number(searchParams.limit) : 30}
      orderBy={searchParams.orderBy ? String(searchParams.orderBy) : "id"}
      order={
        searchParams.order && String(searchParams.order) == "asc"
          ? "asc"
          : "desc"
      }
    />
  );
}
