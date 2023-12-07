import * as Yup from "yup";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMemo, useEffect } from "react";

import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Grid from "@mui/material/Unstable_Grid2";
import LoadingButton from "@mui/lab/LoadingButton";
import Typography from "@mui/material/Typography";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

import { paths } from "@/routes/paths";
import { useRouter } from "@/routes/hooks";

import { useResponsive } from "@/hooks/use-responsive";

import { useSnackbar } from "@/components/snackbar";
import FormProvider, { RHFSwitch, RHFTextField } from "@/components/hook-form";

import { INationalHolidayItem } from "@/types/national-holiday";
import axios, { endpoints } from "@/utils/axios";

// ----------------------------------------------------------------------

type Props = {
  currentNationalHoliday?: INationalHolidayItem;
};

export default function NationalHolidayNewEditForm({
  currentNationalHoliday,
}: Props) {
  const router = useRouter();

  const mdUp = useResponsive("up", "md");

  const { enqueueSnackbar } = useSnackbar();

  const NewNationalHolidaySchema = Yup.object().shape({
    name: Yup.string().required("祝日名を入力してください。"),
    date: Yup.mixed<any>().required("日付を入力してください。"),
  });

  const defaultValues = useMemo(
    () => ({
      name: currentNationalHoliday?.name || "",
      date: currentNationalHoliday?.date
        ? new Date(currentNationalHoliday?.date)
        : "",
    }),
    [currentNationalHoliday]
  );

  const methods = useForm({
    resolver: yupResolver(NewNationalHolidaySchema),
    defaultValues,
  });

  const {
    reset,
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    if (currentNationalHoliday) {
      reset(defaultValues);
    }
  }, [currentNationalHoliday, defaultValues, reset]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      let res;
      if (currentNationalHoliday) {
        res = await axios.patch(
          endpoints.nationalHoliday.update(currentNationalHoliday.id),
          {
            name: data.name,
            date:
              data.date.getFullYear() +
              "-" +
              ("00" + (data.date.getMonth() + 1)).slice(-2) +
              "-" +
              ("00" + data.date.getDate()).slice(-2),
          }
        );
      } else {
        res = await axios.post(endpoints.nationalHoliday.create, {
          name: data.name,
          date:
            data.date.getFullYear() +
            "-" +
            ("00" + (data.date.getMonth() + 1)).slice(-2) +
            "-" +
            ("00" + data.date.getDate()).slice(-2),
        });
      }
      if (res.status !== 200) {
        enqueueSnackbar("エラーが発生しました。", { variant: "error" });
        return;
      }
      reset();
      enqueueSnackbar(
        currentNationalHoliday ? "更新しました！" : "作成しました！"
      );
      router.push(paths.admin.nationalHoliday.root);
    } catch (error) {
      console.error(error);
    }
  });

  const renderDetails = (
    <>
      <Grid xs={12}>
        <Card>
          <Stack spacing={3} sx={{ p: 3 }}>
            <RHFTextField name="name" label="祝日名" />

            <Stack spacing={1.5}>
              <Typography variant="subtitle2">日付</Typography>
              <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
                <Controller
                  name="date"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <DatePicker
                      {...field}
                      format="yyyy/MM/dd"
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          error: !!error,
                          helperText: error?.message,
                        },
                      }}
                    />
                  )}
                />
              </Stack>
            </Stack>
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
          {!currentNationalHoliday ? "祝日を作成" : "祝日を変更"}
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
