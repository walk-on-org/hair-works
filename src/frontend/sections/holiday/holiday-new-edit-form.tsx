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

import { IHolidayItem } from "@/types/holiday";
import axios, { endpoints } from "@/utils/axios";

// ----------------------------------------------------------------------

type Props = {
  currentHoliday?: IHolidayItem;
};

export default function HolidayNewEditForm({ currentHoliday }: Props) {
  const router = useRouter();

  const mdUp = useResponsive("up", "md");

  const { enqueueSnackbar } = useSnackbar();

  const NewHolidaySchema = Yup.object().shape({
    name: Yup.string().required("休日名を入力してください。"),
    permalink: Yup.string().required("パーマリンクを入力してください。"),
    status: Yup.boolean(),
  });

  const defaultValues = useMemo(
    () => ({
      name: currentHoliday?.name || "",
      permalink: currentHoliday?.permalink || "",
      status: currentHoliday?.status == "1" ? true : false || false,
    }),
    [currentHoliday]
  );

  const methods = useForm({
    resolver: yupResolver(NewHolidaySchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    if (currentHoliday) {
      reset(defaultValues);
    }
  }, [currentHoliday, defaultValues, reset]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      let res;
      if (currentHoliday) {
        res = await axios.patch(endpoints.holiday.update(currentHoliday.id), {
          name: data.name,
          permalink: data.permalink,
          status: data.status ? 1 : 0,
        });
      } else {
        res = await axios.post(endpoints.holiday.create, {
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
      enqueueSnackbar(currentHoliday ? "更新しました！" : "作成しました！");
      router.push(paths.admin.holiday.root);
    } catch (error) {
      console.error(error);
    }
  });

  const renderDetails = (
    <>
      <Grid xs={12}>
        <Card>
          <Stack spacing={3} sx={{ p: 3 }}>
            <RHFTextField name="name" label="休日名" />

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
          {!currentHoliday ? "休日を作成" : "休日を変更"}
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
