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

import { IApplicantItem } from "@/types/applicant";
import axios, { endpoints } from "@/utils/axios";
import ApplicantEditDetails from "./applicant-edit-details";
import ApplicantEditContactHistories from "./applicant-edit-contact-histories";

// ----------------------------------------------------------------------

type Props = {
  currentApplicant: IApplicantItem;
};

export default function ApplicantEditForm({ currentApplicant }: Props) {
  const router = useRouter();

  const mdUp = useResponsive("up", "md");

  const { enqueueSnackbar } = useSnackbar();

  const NewApplicantSchema = Yup.object().shape({
    status: Yup.string().required("状態を入力してください。"),
    applicant_contact_histories: Yup.array().of(
      Yup.object().shape({
        id: Yup.string(),
        contact_date:
          Yup.mixed<any>().required("コンタクト日を入力してください。"),
        contact_memo: Yup.string().required("メモを入力してください。"),
      })
    ),
  });

  const defaultValues = useMemo(
    () => ({
      status: currentApplicant?.status || "",
      applicant_contact_histories:
        currentApplicant?.applicant_contact_histories || [],
    }),
    [currentApplicant]
  );

  const methods = useForm({
    resolver: yupResolver(NewApplicantSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = methods;

  useEffect(() => {
    if (currentApplicant) {
      reset(defaultValues);
    }
  }, [currentApplicant, defaultValues, reset]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      // 更新のみ
      await axios.post(endpoints.applicant.update(currentApplicant.id), {
        status: Number(data.status),
        applicant_contact_histories: data.applicant_contact_histories,
      });
      reset();
      enqueueSnackbar("更新しました！");
      router.push(paths.admin.applicant.root);
    } catch (error) {
      enqueueSnackbar("エラーが発生しました。", { variant: "error" });
      console.error(error);
    }
  });

  const renderDetails = (
    <>
      <Grid xs={12}>
        <Card>
          <ApplicantEditDetails />

          <ApplicantEditContactHistories />
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
          {"応募者を変更"}
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
