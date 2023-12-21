import * as Yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMemo, useEffect } from "react";

import Card from "@mui/material/Card";
import Grid from "@mui/material/Unstable_Grid2";
import LoadingButton from "@mui/lab/LoadingButton";

import { paths } from "@/routes/paths";
import { useRouter } from "@/routes/hooks";

import { useResponsive } from "@/hooks/use-responsive";

import { useSnackbar } from "@/components/snackbar";
import FormProvider from "@/components/hook-form";

import { IMemberItem } from "@/types/member";
import { IPrefectureItem } from "@/types/prefecture";
import { IEmploymentItem } from "@/types/employment";
import { IQualificationItem } from "@/types/qualification";
import { ILpJobCategoryItem } from "@/types/lp-job-category";
import axios, { endpoints } from "@/utils/axios";
import MemberEditDetails from "./member-edit-details";

// ----------------------------------------------------------------------

type Props = {
  currentMember: IMemberItem;
  prefectures: IPrefectureItem[];
  employments: IEmploymentItem[];
  qualifications: IQualificationItem[];
  lpJobCategories: ILpJobCategoryItem[];
  members: IMemberItem[];
};

export default function MemberEditForm({
  currentMember,
  prefectures,
  employments,
  qualifications,
  lpJobCategories,
  members,
}: Props) {
  const router = useRouter();

  const mdUp = useResponsive("up", "md");

  const { enqueueSnackbar } = useSnackbar();

  const NewMemberSchema = Yup.object().shape({
    name: Yup.string().required("氏名を入力してください。"),
    name_kana: Yup.string().required("カナ名を入力してください。"),
    birthyear: Yup.number().required("生まれ年を入力してください。"),
    postcode: Yup.string(),
    prefecture_id: Yup.string().required("都道府県を入力してください。"),
    address: Yup.string().required("住所を入力してください。"),
    phone: Yup.string()
      .required("電話番号を入力してください。")
      .matches(/^0[0-9]{1,3}(-)?[0-9]{2,4}(-)?[0-9]{3,4}$/, {
        message: "電話番号形式ではありません。",
        excludeEmptyString: true,
      }),
    email: Yup.string(),
    change_time: Yup.string().required("希望転職時期を入力してください。"),
    retirement_time: Yup.string().required("退職意向を入力してください。"),
    employment_id: Yup.string().required("希望勤務体系を入力してください。"),
    emp_prefecture_id: Yup.string().required("希望勤務地を入力してください。"),
    qualification_names: Yup.array().min(1, "資格は1つ以上選択してください。"),
    lp_job_category_names: Yup.array().min(
      1,
      "希望職種は1つ以上選択してください。"
    ),
    status: Yup.string().required("状態を入力してください。"),
    introduction_name: Yup.string(),
    introduction_member_id: Yup.string(),
    introduction_gift_status: Yup.string().required(
      "紹介プレゼントステータスを入力してください。"
    ),
    // TODO 応募履歴
  });

  const defaultValues = useMemo(
    () => ({
      name: currentMember?.name || "",
      name_kana: currentMember?.name_kana || "",
      birthyear: currentMember?.birthyear || 0,
      postcode: currentMember?.postcode || "",
      prefecture_id: currentMember?.prefecture_id || "",
      address: currentMember?.address || "",
      phone: currentMember?.phone || "",
      email: currentMember?.email || "",
      change_time: currentMember?.change_time || "",
      retirement_time: currentMember?.retirement_time || "",
      employment_id: currentMember?.employment_id || "",
      emp_prefecture_id: currentMember?.emp_prefecture_id || "",
      qualification_names: currentMember?.qualification_names || [],
      lp_job_category_names: currentMember?.lp_job_category_names || [],
      status: currentMember?.status || "",
      introduction_name: currentMember?.introduction_name || "",
      introduction_member_id: currentMember?.introduction_member_id || "",
      introduction_gift_status: currentMember?.introduction_gift_status || "",
    }),
    [currentMember]
  );

  const methods = useForm({
    resolver: yupResolver(NewMemberSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = methods;

  useEffect(() => {
    if (currentMember) {
      reset(defaultValues);
    }
  }, [currentMember, defaultValues, reset]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      const selectQualificationIds = qualifications
        .filter((row) => {
          return data.qualification_names?.includes(row.name);
        })
        .map((row) => row.id);
      const selectLpJobCategoryIds = lpJobCategories
        .filter((row) => {
          return data.lp_job_category_names?.includes(row.name);
        })
        .map((row) => row.id);
      // 更新のみ
      await axios.post(endpoints.member.update(currentMember.id), {
        name: data.name,
        name_kana: data.name_kana,
        birthyear: Number(data.birthyear),
        postcode: data.postcode,
        prefecture_id: Number(data.prefecture_id),
        address: data.address,
        phone: data.phone,
        email: data.email,
        change_time: Number(data.change_time),
        retirement_time: Number(data.retirement_time),
        employment_id: Number(data.employment_id),
        emp_prefecture_id: Number(data.emp_prefecture_id),
        status: Number(data.status),
        introduction_name: data.introduction_name,
        introduction_member_id: data.introduction_member_id
          ? Number(data.introduction_member_id)
          : null,
        introduction_gift_status: Number(data.introduction_gift_status),
        qualification_ids: selectQualificationIds,
        lp_job_category_ids: selectLpJobCategoryIds,
      });
      reset();
      enqueueSnackbar("更新しました！");
      router.push(paths.admin.member.root);
    } catch (error) {
      enqueueSnackbar("エラーが発生しました。", { variant: "error" });
      console.error(error);
    }
  });

  const renderDetails = (
    <>
      <Grid xs={12}>
        <Card>
          <MemberEditDetails
            prefectures={prefectures}
            employments={employments}
            qualifications={qualifications}
            lpJobCategories={lpJobCategories}
            members={members}
          />
        </Card>
      </Grid>
    </>
  );

  const renderActions = (
    <>
      {mdUp && <Grid md={4} />}
      <Grid xs={12} md={8} sx={{ display: "flex", alignItems: "center" }}>
        <LoadingButton
          type="submit"
          variant="contained"
          size="large"
          loading={isSubmitting}
          onClick={() => console.log(errors)}
        >
          {"会員情報を変更"}
        </LoadingButton>
      </Grid>
    </>
  );

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        {renderDetails}

        {renderActions}
      </Grid>
    </FormProvider>
  );
}
