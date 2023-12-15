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

import { ICommitmentTermItem } from "@/types/commitment-term";
import { IEmploymentItem } from "@/types/employment";
import { IHolidayItem } from "@/types/holiday";
import { IJobItem } from "@/types/job";
import { IJobCategoryItem } from "@/types/job-category";
import { IOfficeItem } from "@/types/office";
import { IPositionItem } from "@/types/position";
import { IQualificationItem } from "@/types/qualification";
import axios, { endpoints } from "@/utils/axios";
import JobNewEditDetails from "./job-new-edit-details";

// ----------------------------------------------------------------------

type Props = {
  currentJob?: IJobItem;
  offices: IOfficeItem[];
  jobCategories: IJobCategoryItem[];
  positions: IPositionItem[];
  employments: IEmploymentItem[];
  commitmentTerms: ICommitmentTermItem[];
  holidays: IHolidayItem[];
  qualifications: IQualificationItem[];
};

export default function JobNewEditForm({
  currentJob,
  offices,
  jobCategories,
  positions,
  employments,
  commitmentTerms,
  holidays,
  qualifications,
}: Props) {
  const router = useRouter();

  const mdUp = useResponsive("up", "md");

  const { enqueueSnackbar } = useSnackbar();

  const NewJobSchema = Yup.object().shape({
    name: Yup.string().required("求人名を入力してください。"),
    office_id: Yup.string().required("事業所を入力してください。"),
    status: Yup.string().required("状態を入力してください。"),
    pickup: Yup.boolean(),
    private: Yup.boolean(),
    recommend: Yup.boolean(),
    indeed_private: Yup.boolean(),
    minimum_wage_ok: Yup.boolean(),
    job_category_id: Yup.string().required("職種を入力してください。"),
    position_id: Yup.string().required("役職/役割を入力してください。"),
    employment_id: Yup.string().required("雇用形態を入力してください。"),
    m_salary_lower: Yup.number(),
    m_salary_upper: Yup.number(),
    t_salary_lower: Yup.number(),
    t_salary_upper: Yup.number(),
    d_salary_lower: Yup.number(),
    d_salary_upper: Yup.number(),
    commission_lower: Yup.number(),
    commission_upper: Yup.number(),
    salary: Yup.string(),
    work_time: Yup.string(),
    job_description: Yup.string(),
    holiday_names: Yup.array(),
    holiday: Yup.string(),
    welfare: Yup.string(),
    qualification_names: Yup.array(),
    entry_requirement: Yup.string(),
    catch_copy: Yup.string(),
    recommend_point: Yup.string(),
    salon_message: Yup.string(),
    commitment_term_names: Yup.array(),
  });

  const defaultValues = useMemo(
    () => ({
      name: currentJob?.name || "",
      office_id: currentJob?.office_id || "",
      status: currentJob?.status || "",
      pickup: currentJob?.pickup == "1" ? true : false || false,
      private: currentJob?.private == "1" ? true : false || false,
      recommend: currentJob?.recommend == "1" ? true : false || false,
      indeed_private: currentJob?.indeed_private == "1" ? true : false || false,
      minimum_wage_ok:
        currentJob?.minimum_wage_ok == "1" ? true : false || false,
      job_category_id: currentJob?.job_category_id || "",
      position_id: currentJob?.position_id || "",
      employment_id: currentJob?.employment_id || "",
      m_salary_lower: currentJob?.m_salary_lower || 0,
      m_salary_upper: currentJob?.m_salary_upper || 0,
      t_salary_lower: currentJob?.t_salary_lower || 0,
      t_salary_upper: currentJob?.t_salary_upper || 0,
      d_salary_lower: currentJob?.d_salary_lower || 0,
      d_salary_upper: currentJob?.d_salary_upper || 0,
      commission_lower: currentJob?.commission_lower || 0,
      commission_upper: currentJob?.commission_upper || 0,
      salary: currentJob?.salary || "",
      work_time: currentJob?.work_time || "",
      job_description: currentJob?.job_description || "",
      holiday_names: currentJob?.holiday_names || [],
      holiday: currentJob?.holiday || "",
      welfare: currentJob?.welfare || "",
      qualification_names: currentJob?.qualification_names || [],
      entry_requirement: currentJob?.entry_requirement || "",
      catch_copy: currentJob?.catch_copy || "",
      recommend_point: currentJob?.recommend_point || "",
      salon_message: currentJob?.salon_message || "",
      commitment_term_names: currentJob?.commitment_term_names || [],
    }),
    [currentJob]
  );

  const methods = useForm({
    resolver: yupResolver(NewJobSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = methods;

  useEffect(() => {
    if (currentJob) {
      reset(defaultValues);
    }
  }, [currentJob, defaultValues, reset]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      const selectCommitmentTermIds = commitmentTerms
        .filter((row) => {
          return data.commitment_term_names?.includes(row.name);
        })
        .map((row) => row.id);
      const selectHolidayIds = holidays
        .filter((row) => {
          return data.holiday_names?.includes(row.name);
        })
        .map((row) => row.id);
      const selectQualificationIds = qualifications
        .filter((row) => {
          return data.qualification_names?.includes(row.name);
        })
        .map((row) => row.id);
      if (currentJob) {
        await axios.post(
          endpoints.job.update(currentJob.id),
          {
            name: data.name,
            office_id: Number(data.office_id),
            status: Number(data.status),
            pickup: data.pickup ? 1 : 0,
            private: data.private ? 1 : 0,
            recommend: data.recommend ? 1 : 0,
            indeed_private: data.indeed_private ? 1 : 0,
            minimum_wage_ok: data.minimum_wage_ok ? 1 : 0,
            job_category_id: Number(data.job_category_id),
            position_id: Number(data.position_id),
            employment_id: Number(data.employment_id),
            m_salary_lower:
              data.m_salary_lower != 0 ? data.m_salary_lower : null,
            m_salary_upper:
              data.m_salary_upper != 0 ? data.m_salary_upper : null,
            t_salary_lower:
              data.t_salary_lower != 0 ? data.t_salary_lower : null,
            t_salary_upper:
              data.t_salary_upper != 0 ? data.t_salary_upper : null,
            d_salary_lower:
              data.d_salary_lower != 0 ? data.d_salary_lower : null,
            d_salary_upper:
              data.d_salary_upper != 0 ? data.d_salary_upper : null,
            commission_lower:
              data.commission_lower != 0 ? data.commission_lower : null,
            commission_upper:
              data.commission_upper != 0 ? data.commission_upper : null,
            salary: data.salary,
            work_time: data.work_time,
            job_description: data.job_description,
            holiday_ids: selectHolidayIds,
            holiday: data.holiday,
            welfare: data.welfare,
            qualification_ids: selectQualificationIds,
            entry_requirement: data.entry_requirement,
            catch_copy: data.catch_copy,
            recommend_point: data.recommend_point,
            salon_message: data.salon_message,
            commitment_term_ids: selectCommitmentTermIds,
          },
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
      } else {
        await axios.post(
          endpoints.job.create,
          {
            name: data.name,
            office_id: Number(data.office_id),
            status: Number(data.status),
            pickup: data.pickup ? 1 : 0,
            private: data.private ? 1 : 0,
            recommend: data.recommend ? 1 : 0,
            indeed_private: data.indeed_private ? 1 : 0,
            minimum_wage_ok: data.minimum_wage_ok ? 1 : 0,
            job_category_id: Number(data.job_category_id),
            position_id: Number(data.position_id),
            employment_id: Number(data.employment_id),
            m_salary_lower:
              data.m_salary_lower != 0 ? data.m_salary_lower : null,
            m_salary_upper:
              data.m_salary_upper != 0 ? data.m_salary_upper : null,
            t_salary_lower:
              data.t_salary_lower != 0 ? data.t_salary_lower : null,
            t_salary_upper:
              data.t_salary_upper != 0 ? data.t_salary_upper : null,
            d_salary_lower:
              data.d_salary_lower != 0 ? data.d_salary_lower : null,
            d_salary_upper:
              data.d_salary_upper != 0 ? data.d_salary_upper : null,
            commission_lower:
              data.commission_lower != 0 ? data.commission_lower : null,
            commission_upper:
              data.commission_upper != 0 ? data.commission_upper : null,
            salary: data.salary,
            work_time: data.work_time,
            job_description: data.job_description,
            holiday_ids: selectHolidayIds,
            holiday: data.holiday,
            welfare: data.welfare,
            qualification_ids: selectQualificationIds,
            entry_requirement: data.entry_requirement,
            catch_copy: data.catch_copy,
            recommend_point: data.recommend_point,
            salon_message: data.salon_message,
            commitment_term_ids: selectCommitmentTermIds,
          },
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
      }
      reset();
      enqueueSnackbar(currentJob ? "更新しました！" : "作成しました！");
      router.push(paths.admin.job.root);
    } catch (error) {
      enqueueSnackbar("エラーが発生しました。", { variant: "error" });
      console.error(error);
    }
  });

  const renderDetails = (
    <>
      <Grid xs={12}>
        <Card>
          <JobNewEditDetails
            offices={offices}
            jobCatgegories={jobCategories}
            positions={positions}
            employments={employments}
            commitmentTerms={commitmentTerms}
            holidays={holidays}
            qualifications={qualifications}
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
          {!currentJob ? "求人を作成" : "求人を変更"}
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
