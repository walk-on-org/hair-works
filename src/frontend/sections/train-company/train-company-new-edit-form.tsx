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
import FormProvider, { RHFSelect, RHFTextField } from "@/components/hook-form";

import { ITrainCompanyItem } from "@/types/train-company";
import axios, { endpoints } from "@/utils/axios";
import { TRAIN_STATUS_OPTIONS } from "@/config-global";

// ----------------------------------------------------------------------

type Props = {
  currentTrainCompany?: ITrainCompanyItem;
};

export default function TrainCompanyNewEditForm({
  currentTrainCompany,
}: Props) {
  const router = useRouter();

  const mdUp = useResponsive("up", "md");

  const { enqueueSnackbar } = useSnackbar();

  const NewTrainComapnySchema = Yup.object().shape({
    name: Yup.string().required("鉄道事業者名を入力してください。"),
    name_r: Yup.string().required("鉄道事業者（略称）を入力してください。"),
    status: Yup.string().required("状態を入力してください。"),
    sort: Yup.number()
      .required("ソート順を入力してください。")
      .moreThan(0, "ソート順は0より大きい値で入力してください。"),
  });

  const defaultValues = useMemo(
    () => ({
      name: currentTrainCompany?.name || "",
      name_r: currentTrainCompany?.name_r || "",
      status: String(currentTrainCompany?.status) || "",
      sort: currentTrainCompany?.sort || 0,
    }),
    [currentTrainCompany]
  );

  const methods = useForm({
    resolver: yupResolver(NewTrainComapnySchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    if (currentTrainCompany) {
      reset(defaultValues);
    }
  }, [currentTrainCompany, defaultValues, reset]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (currentTrainCompany) {
        await axios.patch(
          endpoints.trainCompany.update(currentTrainCompany.id),
          {
            name: data.name,
            name_r: data.name_r,
            status: Number(data.status),
            sort: data.sort,
          }
        );
      } else {
        await axios.post(endpoints.trainCompany.create, {
          name: data.name,
          name_r: data.name_r,
          status: Number(data.status),
          sort: data.sort,
        });
      }
      reset();
      enqueueSnackbar(
        currentTrainCompany ? "更新しました！" : "作成しました！"
      );
      router.push(paths.admin.trainCompany.root);
    } catch (error) {
      enqueueSnackbar("エラーが発生しました。", { variant: "error" });
      console.error(error);
    }
  });

  const renderDetails = (
    <>
      <Grid xs={12}>
        <Card>
          <Stack spacing={3} sx={{ p: 3 }}>
            <RHFTextField name="name" label="鉄道事業者名" />

            <RHFTextField name="name_r" label="鉄道事業者名（略称）" />

            <RHFSelect native name="status" label="状態">
              <option value=""></option>
              {TRAIN_STATUS_OPTIONS.map((status) => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </RHFSelect>

            <RHFTextField
              name="sort"
              label="ソート順"
              placeholder="0"
              type="number"
            />
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
          {!currentTrainCompany ? "鉄道事業者を作成" : "鉄道事業者を変更"}
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
