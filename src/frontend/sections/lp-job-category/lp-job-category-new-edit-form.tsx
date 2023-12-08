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

import { ILpJobCategoryItem } from "@/types/lp-job-category";
import axios, { endpoints } from "@/utils/axios";

// ----------------------------------------------------------------------

type Props = {
  currentLpJobCategory?: ILpJobCategoryItem;
};

export default function LpJobCategoryNewEditForm({
  currentLpJobCategory,
}: Props) {
  const router = useRouter();

  const mdUp = useResponsive("up", "md");

  const { enqueueSnackbar } = useSnackbar();

  const NewLpJobCategorySchema = Yup.object().shape({
    name: Yup.string().required("LP職種名を入力してください。"),
    status: Yup.boolean(),
  });

  const defaultValues = useMemo(
    () => ({
      name: currentLpJobCategory?.name || "",
      status: currentLpJobCategory?.status == "1" ? true : false || false,
    }),
    [currentLpJobCategory]
  );

  const methods = useForm({
    resolver: yupResolver(NewLpJobCategorySchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    if (currentLpJobCategory) {
      reset(defaultValues);
    }
  }, [currentLpJobCategory, defaultValues, reset]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (currentLpJobCategory) {
        await axios.patch(
          endpoints.lpJobCategory.update(currentLpJobCategory.id),
          {
            name: data.name,
            status: data.status ? 1 : 0,
          }
        );
      } else {
        await axios.post(endpoints.lpJobCategory.create, {
          name: data.name,
          status: data.status ? 1 : 0,
        });
      }
      reset();
      enqueueSnackbar(
        currentLpJobCategory ? "更新しました！" : "作成しました！"
      );
      router.push(paths.admin.lpJobCategory.root);
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
            <RHFTextField name="name" label="LP職種名" />

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
          {!currentLpJobCategory ? "LP職種を作成" : "LP職種を変更"}
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
