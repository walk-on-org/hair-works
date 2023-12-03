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

import { IEmploymentItem } from "@/types/employment";
import axios, { endpoints } from "@/utils/axios";

// ----------------------------------------------------------------------

type Props = {
  currentEmployment?: IEmploymentItem;
};

export default function EmploymentNewEditForm({ currentEmployment }: Props) {
  const router = useRouter();

  const mdUp = useResponsive("up", "md");

  const { enqueueSnackbar } = useSnackbar();

  const NewEmploymentSchema = Yup.object().shape({
    name: Yup.string().required("雇用形態名を入力してください。"),
    permalink: Yup.string().required("パーマリンクを入力してください。"),
    status: Yup.boolean(),
  });

  const defaultValues = useMemo(
    () => ({
      name: currentEmployment?.name || "",
      permalink: currentEmployment?.permalink || "",
      status: currentEmployment?.status == "1" ? true : false || false,
    }),
    [currentEmployment]
  );

  const methods = useForm({
    resolver: yupResolver(NewEmploymentSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    if (currentEmployment) {
      reset(defaultValues);
    }
  }, [currentEmployment, defaultValues, reset]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      let res;
      if (currentEmployment) {
        res = await axios.patch(
          endpoints.employment.update(currentEmployment.id),
          {
            name: data.name,
            permalink: data.permalink,
            status: data.status ? 1 : 0,
          }
        );
      } else {
        res = await axios.post(endpoints.employment.create, {
          name: data.name,
          permalink: data.permalink,
          status: data.status ? 1 : 0,
        });
      }
      if (res.status !== 200) {
        enqueueSnackbar("エラーが発生しました。", { variant: "error" });
        return;
      }
      reset();
      enqueueSnackbar(currentEmployment ? "更新しました！" : "作成しました！");
      router.push(paths.admin.employment.root);
    } catch (error) {
      console.error(error);
    }
  });

  const renderDetails = (
    <>
      <Grid xs={12}>
        <Card>
          <Stack spacing={3} sx={{ p: 3 }}>
            <RHFTextField name="name" label="雇用形態名" />

            <RHFTextField name="permalink" label="パーマリンク" />

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
          {!currentEmployment ? "雇用形態を作成" : "雇用形態を変更"}
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
