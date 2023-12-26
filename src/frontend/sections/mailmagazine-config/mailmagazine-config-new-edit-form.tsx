import * as Yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMemo, useEffect, useCallback, useState } from "react";

import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Card from "@mui/material/Card";
import { alpha } from "@mui/material/styles";
import Grid from "@mui/material/Unstable_Grid2";
import LoadingButton from "@mui/lab/LoadingButton";

import { paths } from "@/routes/paths";
import { useRouter } from "@/routes/hooks";

import { useResponsive } from "@/hooks/use-responsive";

import { useSnackbar } from "@/components/snackbar";
import FormProvider from "@/components/hook-form";

import { IMailmagazineConfigItem } from "@/types/mailmagazine-config";
import { ILpJobCategoryItem } from "@/types/lp-job-category";
import { IPrefectureItem } from "@/types/prefecture";
import { ICityItem } from "@/types/city";
import { IEmploymentItem } from "@/types/employment";
import { IQualificationItem } from "@/types/qualification";
import { IJobCategoryItem } from "@/types/job-category";
import { ICorporationItem } from "@/types/corporation";
import axios, { endpoints } from "@/utils/axios";
import MailmagazineConfigNewEditBasic from "./mailmagazine-config-new-edit-basic";
import MailmagazineConfigNewEditMember from "./mailmagazine-config-new-edit-member";
import MailmagazineConfigNewEditJob from "./mailmagazine-config-new-edit-job";
import { CHANGE_TIME_OPTIONS, MEMBER_STATUS_OPTIONS } from "@/config-global";

// ----------------------------------------------------------------------

type Props = {
  currentMailmagazineConfig?: IMailmagazineConfigItem;
  lpJobCategories: ILpJobCategoryItem[];
  prefectures: IPrefectureItem[];
  cities: ICityItem[];
  employments: IEmploymentItem[];
  qualifications: IQualificationItem[];
  jobCategories: IJobCategoryItem[];
  corporations: ICorporationItem[];
};

export default function MailmagazineConfigNewEditForm({
  currentMailmagazineConfig,
  lpJobCategories,
  prefectures,
  cities,
  employments,
  qualifications,
  jobCategories,
  corporations,
}: Props) {
  const router = useRouter();
  const mdUp = useResponsive("up", "md");
  const { enqueueSnackbar } = useSnackbar();
  const [currentTab, setCurrentTab] = useState("basic");
  const handleChangeTab = useCallback(
    (event: React.SyntheticEvent, newValue: string) => {
      setCurrentTab(newValue);
    },
    []
  );

  const NewMailmagazineConfigSchema = Yup.object().shape({
    title: Yup.string().required("タイトルを入力してください。"),
    deliver_job_type: Yup.string(),
    job_keyword: Yup.string(),
    member_birthyear_from: Yup.number(),
    member_birthyear_to: Yup.number(),
    job_match_lp_job_category: Yup.boolean(),
    job_match_employment: Yup.boolean(),
    job_match_distance: Yup.number(),
    job_count_limit: Yup.number().max(
      3,
      "メール内求人件数は3以下で入力してください。"
    ),
    search_other_corporation: Yup.boolean(),
    j_corporation_labels: Yup.array(),
    j_job_category_names: Yup.array(),
    mailmagazine_m_areas: Yup.array().of(
      Yup.object().shape({
        id: Yup.string(),
        prefecture_id: Yup.string().required("都道府県を入力してください。"),
        city_id: Yup.string(),
      })
    ),
    m_lp_job_category_names: Yup.array(),
    m_emp_prefecture_names: Yup.array(),
    m_employment_names: Yup.array(),
    m_qualification_names: Yup.array(),
    m_status_names: Yup.array(),
    m_change_time_names: Yup.array(),
  });

  const defaultValues = useMemo(
    () => ({
      title: currentMailmagazineConfig?.title || "",
      deliver_job_type:
        String(currentMailmagazineConfig?.deliver_job_type) || "",
      job_keyword: currentMailmagazineConfig?.job_keyword || "",
      member_birthyear_from:
        currentMailmagazineConfig?.member_birthyear_from || 0,
      member_birthyear_to: currentMailmagazineConfig?.member_birthyear_to || 0,
      job_match_lp_job_category:
        currentMailmagazineConfig?.job_match_lp_job_category == "1"
          ? true
          : false || false,
      job_match_employment:
        currentMailmagazineConfig?.job_match_employment == "1"
          ? true
          : false || false,
      job_match_distance: currentMailmagazineConfig?.job_match_distance || 0,
      job_count_limit: currentMailmagazineConfig?.job_count_limit || 0,
      search_other_corporation:
        currentMailmagazineConfig?.search_other_corporation == "1"
          ? true
          : false || false,
      j_corporation_labels:
        currentMailmagazineConfig?.j_corporation_labels || [],
      j_job_category_names:
        currentMailmagazineConfig?.j_job_category_names || [],
      mailmagazine_m_areas:
        currentMailmagazineConfig?.mailmagazine_m_areas || [],
      m_lp_job_category_names:
        currentMailmagazineConfig?.m_lp_job_category_names || [],
      m_emp_prefecture_names:
        currentMailmagazineConfig?.m_emp_prefecture_names || [],
      m_employment_names: currentMailmagazineConfig?.m_employment_names || [],
      m_qualification_names:
        currentMailmagazineConfig?.m_qualification_names || [],
      m_status_names: currentMailmagazineConfig?.m_status_names || [],
      m_change_time_names: currentMailmagazineConfig?.m_change_time_names || [],
    }),
    [currentMailmagazineConfig]
  );

  const methods = useForm({
    resolver: yupResolver(NewMailmagazineConfigSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = methods;

  useEffect(() => {
    if (currentMailmagazineConfig) {
      reset(defaultValues);
    }
  }, [currentMailmagazineConfig, defaultValues, reset]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      console.log(data.j_corporation_labels);
      const selectJCorporationIds = data.j_corporation_labels?.map((row) => {
        console.log(row);
        let match = row.match(/^([0-9]+)(：)/g);
        console.log(match);
        if (match != undefined && match.length > 0) {
          return Number(match[0].replace("：", ""));
        } else {
          return;
        }
      });
      const selectJJobCategoryIds = jobCategories
        .filter((row) => {
          return data.j_job_category_names?.includes(row.name);
        })
        .map((row) => row.id);
      const selectMLpJobCategoryIds = lpJobCategories
        .filter((row) => {
          return data.m_lp_job_category_names?.includes(row.name);
        })
        .map((row) => row.id);
      const selectMEmpPrefectureIds = prefectures
        .filter((row) => {
          return data.m_emp_prefecture_names?.includes(row.name);
        })
        .map((row) => row.id);
      const selectMEmploymentIds = employments
        .filter((row) => {
          return data.m_employment_names?.includes(row.name);
        })
        .map((row) => row.id);
      const selectMQualificationIds = qualifications
        .filter((row) => {
          return data.m_qualification_names?.includes(row.name);
        })
        .map((row) => row.id);
      const selectMStatuses = MEMBER_STATUS_OPTIONS.filter((row) => {
        return data.m_status_names?.includes(row.label);
      }).map((row) => row.value);
      const selectMChangeTimes = CHANGE_TIME_OPTIONS.filter((row) => {
        return data.m_change_time_names?.includes(row.label);
      }).map((row) => row.value);

      // 登録or更新API
      if (currentMailmagazineConfig) {
        await axios.patch(
          endpoints.mailmagazineConfig.update(currentMailmagazineConfig.id),
          {
            title: data.title,
            deliver_job_type: Number(data.deliver_job_type),
            job_keyword: data.job_keyword,
            member_birthyear_from:
              data.member_birthyear_from != 0
                ? data.member_birthyear_from
                : null,
            member_birthyear_to:
              data.member_birthyear_to != 0 ? data.member_birthyear_to : null,
            job_match_lp_job_category: data.job_match_lp_job_category ? 1 : 0,
            job_match_employment: data.job_match_employment ? 1 : 0,
            job_match_distance:
              data.job_match_distance != 0 ? data.job_match_distance : null,
            job_count_limit:
              data.job_count_limit != 0 ? data.job_count_limit : null,
            search_other_corporation: data.search_other_corporation ? 1 : 0,
            j_corporation_ids: selectJCorporationIds,
            j_job_category_ids: selectJJobCategoryIds,
            mailmagazine_m_areas: data.mailmagazine_m_areas,
            m_lp_job_category_ids: selectMLpJobCategoryIds,
            m_emp_prefecture_ids: selectMEmpPrefectureIds,
            m_employment_ids: selectMEmploymentIds,
            m_qualification_ids: selectMQualificationIds,
            m_statuses: selectMStatuses,
            m_change_times: selectMChangeTimes,
          }
        );
      } else {
        await axios.post(endpoints.mailmagazineConfig.create, {
          title: data.title,
          deliver_job_type: Number(data.deliver_job_type),
          job_keyword: data.job_keyword,
          member_birthyear_from:
            data.member_birthyear_from != 0 ? data.member_birthyear_from : null,
          member_birthyear_to:
            data.member_birthyear_to != 0 ? data.member_birthyear_to : null,
          job_match_lp_job_category: data.job_match_lp_job_category ? 1 : 0,
          job_match_employment: data.job_match_employment ? 1 : 0,
          job_match_distance:
            data.job_match_distance != 0 ? data.job_match_distance : null,
          job_count_limit:
            data.job_count_limit != 0 ? data.job_count_limit : null,
          search_other_corporation: data.search_other_corporation ? 1 : 0,
          j_corporation_ids: selectJCorporationIds,
          j_job_category_ids: selectJJobCategoryIds,
          mailmagazine_m_areas: data.mailmagazine_m_areas,
          m_lp_job_category_ids: selectMLpJobCategoryIds,
          m_emp_prefecture_ids: selectMEmpPrefectureIds,
          m_employment_ids: selectMEmploymentIds,
          m_qualification_ids: selectMQualificationIds,
          m_statuses: selectMStatuses,
          m_change_times: selectMChangeTimes,
        });
      }
      reset();
      enqueueSnackbar(
        currentMailmagazineConfig ? "更新しました！" : "作成しました！"
      );
      router.push(paths.admin.mailmagazineConfig.root);
    } catch (error) {
      enqueueSnackbar("エラーが発生しました。", { variant: "error" });
      console.error(error);
    }
  });

  const renderDetails = (
    <>
      <Grid xs={12}>
        <Card>
          <Tabs
            value={currentTab}
            onChange={handleChangeTab}
            sx={{
              px: 3,
              boxShadow: (theme) =>
                `inset 0 -2px 0 0 ${alpha(theme.palette.grey[500], 0.08)}`,
            }}
          >
            {[
              {
                value: "basic",
                label: "基本設定",
              },
              {
                value: "member",
                label: "会員抽出条件",
              },
              {
                value: "job",
                label: "求人抽出条件",
              },
            ].map((tab) => (
              <Tab key={tab.value} value={tab.value} label={tab.label} />
            ))}
          </Tabs>

          {currentTab === "basic" && <MailmagazineConfigNewEditBasic />}

          {currentTab === "member" && (
            <MailmagazineConfigNewEditMember
              currentMailmagazineConfig={currentMailmagazineConfig}
              lpJobCategories={lpJobCategories}
              prefectures={prefectures}
              cities={cities}
              employments={employments}
              qualifications={qualifications}
            />
          )}

          {currentTab === "job" && (
            <MailmagazineConfigNewEditJob
              jobCategories={jobCategories}
              corporations={corporations}
            />
          )}
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
          {!currentMailmagazineConfig
            ? "メルマガ設定を作成"
            : "メルマガ設定を変更"}
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
