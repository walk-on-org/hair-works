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

import { ILineItem } from "@/types/line";
import { ITrainCompanyItem } from "@/types/train-company";
import axios, { endpoints } from "@/utils/axios";
import { TRAIN_STATUS_OPTIONS } from "@/config-global";

// ----------------------------------------------------------------------

type Props = {
  currentLine?: ILineItem;
  trainCompanies: ITrainCompanyItem[];
};

export default function LineNewEditForm({
  currentLine,
  trainCompanies,
}: Props) {
  const router = useRouter();

  const mdUp = useResponsive("up", "md");

  const { enqueueSnackbar } = useSnackbar();

  const NewLineSchema = Yup.object().shape({
    id: Yup.string().required("路線IDを入力してください。"),
    name: Yup.string().required("路線名を入力してください。"),
    permalink: Yup.string().required("パーマリンクを入力してください。"),
    train_company_id: Yup.string().required("鉄道事業者を入力してください。"),
    status: Yup.string().required("状態を入力してください。"),
    sort: Yup.number()
      .required("ソート順を入力してください。")
      .moreThan(0, "ソート順は0より大きい値で入力してください。"),
  });

  const defaultValues = useMemo(
    () => ({
      id: currentLine?.id || "",
      name: currentLine?.name || "",
      permalink: currentLine?.permalink || "",
      train_company_id: currentLine?.train_company_id || "",
      status: String(currentLine?.status) || "",
      sort: currentLine?.sort || 0,
    }),
    [currentLine]
  );

  const methods = useForm({
    resolver: yupResolver(NewLineSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    if (currentLine) {
      reset(defaultValues);
    }
  }, [currentLine, defaultValues, reset]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      let res;
      if (currentLine) {
        res = await axios.patch(endpoints.line.update(currentLine.id), {
          id: Number(data.id),
          name: data.name,
          permalink: data.permalink,
          train_company_id: Number(data.train_company_id),
          status: Number(data.status),
          sort: data.sort,
        });
      } else {
        res = await axios.post(endpoints.line.create, {
          id: Number(data.id),
          name: data.name,
          permalink: data.permalink,
          train_company_id: Number(data.train_company_id),
          status: Number(data.status),
          sort: data.sort,
        });
      }
      if (res.status !== 200) {
        enqueueSnackbar("エラーが発生しました。", { variant: "error" });
        return;
      }
      reset();
      enqueueSnackbar(currentLine ? "更新しました！" : "作成しました！");
      router.push(paths.admin.line.root);
    } catch (error) {
      console.error(error);
    }
  });

  const renderDetails = (
    <>
      <Grid xs={12}>
        <Card>
          <Stack spacing={3} sx={{ p: 3 }}>
            <RHFTextField name="id" label="路線ID" />

            <RHFTextField name="name" label="路線名" />

            <RHFTextField name="permalink" label="パーマリンク" />

            <RHFSelect native name="train_company_id" label="鉄道事業者">
              <option value=""></option>
              {trainCompanies.map((trainCompany) => (
                <option key={trainCompany.id} value={trainCompany.id}>
                  {trainCompany.name}
                </option>
              ))}
            </RHFSelect>

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
          {!currentLine ? "路線を作成" : "路線を変更"}
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
