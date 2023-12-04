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

import { ICityItem } from "@/types/city";
import { IPrefectureItem } from "@/types/prefecture";
import { IGovernmentCityItem } from "@/types/government-city";
import axios, { endpoints } from "@/utils/axios";

// ----------------------------------------------------------------------

type Props = {
  currentCity?: ICityItem;
  prefectures: IPrefectureItem[];
  governmentCities: IGovernmentCityItem[];
};

export default function CityNewEditForm({
  currentCity,
  prefectures,
  governmentCities,
}: Props) {
  const router = useRouter();

  const mdUp = useResponsive("up", "md");

  const { enqueueSnackbar } = useSnackbar();

  const NewCitySchema = Yup.object().shape({
    name: Yup.string().required("役職/役割名を入力してください。"),
    permalink: Yup.string().required("パーマリンクを入力してください。"),
    prefecture_id: Yup.string().required("都道府県を入力してください。"),
    government_city_id: Yup.string(),
  });

  const defaultValues = useMemo(
    () => ({
      name: currentCity?.name || "",
      permalink: currentCity?.permalink || "",
      prefecture_id: currentCity?.prefecture_id || "",
      government_city_id: currentCity?.government_city_id || "",
    }),
    [currentCity]
  );

  const methods = useForm({
    resolver: yupResolver(NewCitySchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    if (currentCity) {
      reset(defaultValues);
    }
  }, [currentCity, defaultValues, reset]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      let res;
      if (currentCity) {
        res = await axios.patch(endpoints.city.update(currentCity.id), {
          name: data.name,
          permalink: data.permalink,
          prefecture_id: Number(data.prefecture_id),
          government_city_id: data.government_city_id
            ? Number(data.government_city_id)
            : "",
        });
      } else {
        res = await axios.post(endpoints.city.create, {
          name: data.name,
          permalink: data.permalink,
          prefecture_id: Number(data.prefecture_id),
          government_city_id: data.government_city_id
            ? Number(data.government_city_id)
            : "",
        });
      }
      if (res.status !== 200) {
        enqueueSnackbar("エラーが発生しました。", { variant: "error" });
        return;
      }
      reset();
      enqueueSnackbar(currentCity ? "更新しました！" : "作成しました！");
      router.push(paths.admin.city.root);
    } catch (error) {
      console.error(error);
    }
  });

  const renderDetails = (
    <>
      <Grid xs={12}>
        <Card>
          <Stack spacing={3} sx={{ p: 3 }}>
            <RHFTextField name="name" label="市区町村名" />

            <RHFTextField name="permalink" label="パーマリンク" />

            <RHFSelect native name="prefecture_id" label="都道府県">
              <option value=""></option>
              {prefectures.map((prefecture) => (
                <option key={prefecture.id} value={prefecture.id}>
                  {prefecture.name}
                </option>
              ))}
            </RHFSelect>

            <RHFSelect native name="government_city_id" label="政令指定都市">
              <option value=""></option>
              {governmentCities.map((governmentCity) => (
                <option key={governmentCity.id} value={governmentCity.id}>
                  {governmentCity.name}
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
          {!currentCity ? "市区町村を作成" : "市区町村を変更"}
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
