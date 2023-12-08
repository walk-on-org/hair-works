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

import { IQualificationItem } from "@/types/qualification";
import axios, { endpoints } from "@/utils/axios";

// ----------------------------------------------------------------------

type Props = {
  currentQualification?: IQualificationItem;
};

export default function QualificationNewEditForm({
  currentQualification,
}: Props) {
  const router = useRouter();

  const mdUp = useResponsive("up", "md");

  const { enqueueSnackbar } = useSnackbar();

  const NewQualificationSchema = Yup.object().shape({
    name: Yup.string().required("保有資格名を入力してください。"),
    status: Yup.boolean(),
    sort: Yup.number()
      .required("ソート順を入力してください。")
      .moreThan(0, "ソート順は0より大きい値で入力してください。"),
  });

  const defaultValues = useMemo(
    () => ({
      name: currentQualification?.name || "",
      status: currentQualification?.status == "1" ? true : false || false,
      sort: currentQualification?.sort || 0,
    }),
    [currentQualification]
  );

  const methods = useForm({
    resolver: yupResolver(NewQualificationSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    if (currentQualification) {
      reset(defaultValues);
    }
  }, [currentQualification, defaultValues, reset]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (currentQualification) {
        await axios.patch(
          endpoints.qualification.update(currentQualification.id),
          {
            name: data.name,
            status: data.status ? 1 : 0,
            sort: data.sort,
          }
        );
      } else {
        await axios.post(endpoints.qualification.create, {
          name: data.name,
          status: data.status ? 1 : 0,
          sort: data.sort,
        });
      }
      reset();
      enqueueSnackbar(
        currentQualification ? "更新しました！" : "作成しました！"
      );
      router.push(paths.admin.qualification.root);
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
            <RHFTextField name="name" label="保有資格名" />

            <RHFSwitch name="status" label="状態" sx={{ m: 0 }} />

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
          {!currentQualification ? "保有資格を作成" : "保有資格を変更"}
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
