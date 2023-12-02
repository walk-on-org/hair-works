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

import { IJobCategoryItem } from "@/types/job-category";
import axios, { endpoints } from "@/utils/axios";

// ----------------------------------------------------------------------

type Props = {
  currentJobCategory?: IJobCategoryItem;
};

export default function JobCategoryNewEditForm({ currentJobCategory }: Props) {
  const router = useRouter();

  const mdUp = useResponsive("up", "md");

  const { enqueueSnackbar } = useSnackbar();

  const NewJobCategorySchema = Yup.object().shape({
    name: Yup.string().required("職種名を入力してください。"),
    permalink: Yup.string().required("パーマリンクを入力してください。"),
    status: Yup.boolean(),
  });

  const defaultValues = useMemo(
    () => ({
      name: currentJobCategory?.name || "",
      permalink: currentJobCategory?.permalink || "",
      status: currentJobCategory?.status == "1" ? true : false || false,
    }),
    [currentJobCategory]
  );

  const methods = useForm({
    resolver: yupResolver(NewJobCategorySchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    if (currentJobCategory) {
      reset(defaultValues);
    }
  }, [currentJobCategory, defaultValues, reset]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      let res;
      if (currentJobCategory) {
        res = await axios.patch(
          endpoints.jobCategory.update(currentJobCategory.id),
          {
            name: data.name,
            permalink: data.permalink,
            status: data.status ? 1 : 0,
          }
        );
      } else {
        res = await axios.post(endpoints.jobCategory.create, {
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
      enqueueSnackbar(currentJobCategory ? "更新しました！" : "作成しました！");
      router.push(paths.admin.jobCategory.root);
    } catch (error) {
      console.error(error);
    }
  });

  const renderDetails = (
    <>
      <Grid xs={12}>
        <Card>
          <Stack spacing={3} sx={{ p: 3 }}>
            <RHFTextField name="name" label="職種名" />

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
          {!currentJobCategory ? "職種を作成" : "職種を変更"}
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
