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

import { IGovernmentCityItem } from "@/types/government-city";
import { IPrefectureItem } from "@/types/prefecture";
import axios, { endpoints } from "@/utils/axios";

// ----------------------------------------------------------------------

type Props = {
  currentGovernmentCity?: IGovernmentCityItem;
  prefectures: IPrefectureItem[];
};

export default function GovernmentCityNewEditForm({
  currentGovernmentCity,
  prefectures,
}: Props) {
  const router = useRouter();

  const mdUp = useResponsive("up", "md");

  const { enqueueSnackbar } = useSnackbar();

  const NewGovernmentSchema = Yup.object().shape({
    name: Yup.string().required("政令指定都市名を入力してください。"),
    permalink: Yup.string().required("パーマリンクを入力してください。"),
    prefecture_id: Yup.string().required("都道府県を入力してください。"),
  });

  const defaultValues = useMemo(
    () => ({
      name: currentGovernmentCity?.name || "",
      permalink: currentGovernmentCity?.permalink || "",
      prefecture_id: currentGovernmentCity?.prefecture_id || "",
    }),
    [currentGovernmentCity]
  );

  const methods = useForm({
    resolver: yupResolver(NewGovernmentSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    if (currentGovernmentCity) {
      reset(defaultValues);
    }
  }, [currentGovernmentCity, defaultValues, reset]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (currentGovernmentCity) {
        await axios.patch(
          endpoints.governmentCity.update(currentGovernmentCity.id),
          {
            name: data.name,
            permalink: data.permalink,
            prefecture_id: Number(data.prefecture_id),
          }
        );
      } else {
        await axios.post(endpoints.governmentCity.create, {
          name: data.name,
          permalink: data.permalink,
          prefecture_id: Number(data.prefecture_id),
        });
      }
      reset();
      enqueueSnackbar(
        currentGovernmentCity ? "更新しました！" : "作成しました！"
      );
      router.push(paths.admin.governmentCity.root);
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
            <RHFTextField name="name" label="政令指定都市名" />

            <RHFTextField name="permalink" label="パーマリンク" />

            <RHFSelect native name="prefecture_id" label="都道府県">
              <option value=""></option>
              {prefectures.map((prefecture) => (
                <option key={prefecture.id} value={prefecture.id}>
                  {prefecture.name}
                </option>
              ))}
            </RHFSelect>
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
          {!currentGovernmentCity ? "政令指定都市を作成" : "政令指定都市を変更"}
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
