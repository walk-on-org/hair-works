import * as Yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMemo, useEffect } from "react";

import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Grid from "@mui/material/Unstable_Grid2";
import LoadingButton from "@mui/lab/LoadingButton";

import { paths } from "@/routes/paths";
import { useRouter } from "@/routes/hooks";

import { useResponsive } from "@/hooks/use-responsive";

import { useSnackbar } from "@/components/snackbar";
import FormProvider, { RHFSwitch, RHFTextField } from "@/components/hook-form";

import { IPlanItem } from "@/types/plan";
import axios, { endpoints } from "@/utils/axios";

// ----------------------------------------------------------------------

type Props = {
  currentPlan?: IPlanItem;
};

export default function PlanNewEditForm({ currentPlan }: Props) {
  const router = useRouter();

  const mdUp = useResponsive("up", "md");

  const { enqueueSnackbar } = useSnackbar();

  const NewPlanSchema = Yup.object().shape({
    name: Yup.string().required("プラン名を入力してください。"),
    term: Yup.number()
      .required("期間(月数)を入力してください。")
      .moreThan(0, "期間(月数)は0より大きい値で入力してください。"),
    amount: Yup.number(),
    status: Yup.boolean(),
  });

  const defaultValues = useMemo(
    () => ({
      name: currentPlan?.name || "",
      term: currentPlan?.term || 0,
      amount: currentPlan?.amount || 0,
      status: currentPlan?.status == "1" ? true : false || false,
    }),
    [currentPlan]
  );

  const methods = useForm({
    resolver: yupResolver(NewPlanSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    if (currentPlan) {
      reset(defaultValues);
    }
  }, [currentPlan, defaultValues, reset]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      let res;
      if (currentPlan) {
        res = await axios.patch(endpoints.plan.update(currentPlan.id), {
          name: data.name,
          term: data.term,
          amount: data.amount,
          status: data.status ? 1 : 0,
        });
      } else {
        res = await axios.post(endpoints.plan.create, {
          name: data.name,
          term: data.term,
          amount: data.amount,
          status: data.status ? 1 : 0,
        });
      }
      if (res.status !== 200) {
        enqueueSnackbar("エラーが発生しました。", { variant: "error" });
        return;
      }
      reset();
      enqueueSnackbar(currentPlan ? "更新しました！" : "作成しました！");
      router.push(paths.admin.plan.root);
    } catch (error) {
      console.error(error);
    }
  });

  const renderDetails = (
    <>
      <Grid xs={12}>
        <Card>
          <Stack spacing={3} sx={{ p: 3 }}>
            <RHFTextField name="name" label="プラン名" />

            <RHFTextField
              name="term"
              label="期間(月数)"
              placeholder="0"
              type="number"
            />

            <RHFTextField
              name="amount"
              label="金額"
              placeholder="0"
              type="number"
            />

            <RHFSwitch name="status" label="状態" sx={{ m: 0 }} />
          </Stack>
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
        >
          {!currentPlan ? "プランを作成" : "プランを変更"}
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
