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

import { IStationItem } from "@/types/station";
import { ILineItem } from "@/types/line";
import { IPrefectureItem } from "@/types/prefecture";
import { ICityItem } from "@/types/city";
import axios, { endpoints } from "@/utils/axios";
import { TRAIN_STATUS_OPTIONS } from "@/config-global";

// ----------------------------------------------------------------------

type Props = {
  currentStation?: IStationItem;
  lines: ILineItem[];
  prefectures: IPrefectureItem[];
  cities: ICityItem[];
};

export default function StationNewEditForm({
  currentStation,
  lines,
  prefectures,
  cities,
}: Props) {
  const router = useRouter();

  const mdUp = useResponsive("up", "md");

  const { enqueueSnackbar } = useSnackbar();

  const NewStationSchema = Yup.object().shape({
    id: Yup.string().required("路線IDを入力してください。"),
    name: Yup.string().required("路線名を入力してください。"),
    permalink: Yup.string().required("パーマリンクを入力してください。"),
    station_group_id: Yup.string().required("駅グループIDを入力してください。"),
    line_id: Yup.string().required("路線を入力してください。"),
    prefecture_id: Yup.string().required("都道府県を入力してください。"),
    city_id: Yup.string().required("市区町村を入力してください。"),
    status: Yup.string().required("状態を入力してください。"),
    sort: Yup.number()
      .required("ソート順を入力してください。")
      .moreThan(0, "ソート順は0より大きい値で入力してください。"),
    lat: Yup.number()
      .required("緯度を入力してください。")
      .moreThan(0, "ソート順は0より大きい値で入力してください。"),
    lng: Yup.number()
      .required("経度を入力してください。")
      .moreThan(0, "ソート順は0より大きい値で入力してください。"),
  });

  const defaultValues = useMemo(
    () => ({
      id: currentStation?.id || "",
      name: currentStation?.name || "",
      permalink: currentStation?.permalink || "",
      station_group_id: currentStation?.station_group_id || "",
      line_id: currentStation?.line_id || "",
      prefecture_id: currentStation?.prefecture_id || "",
      city_id: currentStation?.city_id || "",
      status: String(currentStation?.status) || "",
      sort: currentStation?.sort || 0,
      lat: currentStation?.lat || 0,
      lng: currentStation?.lng || 0,
    }),
    [currentStation]
  );

  const methods = useForm({
    resolver: yupResolver(NewStationSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    if (currentStation) {
      reset(defaultValues);
    }
  }, [currentStation, defaultValues, reset]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      let res;
      if (currentStation) {
        res = await axios.patch(endpoints.station.update(currentStation.id), {
          id: Number(data.id),
          name: data.name,
          permalink: data.permalink,
          station_group_id: data.station_group_id,
          line_id: Number(data.line_id),
          prefecture_id: Number(data.prefecture_id),
          city_id: Number(data.city_id),
          status: Number(data.status),
          sort: data.sort,
          lat: data.lat,
          lng: data.lng,
        });
      } else {
        res = await axios.post(endpoints.station.create, {
          id: Number(data.id),
          name: data.name,
          permalink: data.permalink,
          station_group_id: data.station_group_id,
          line_id: Number(data.line_id),
          prefecture_id: Number(data.prefecture_id),
          city_id: Number(data.city_id),
          status: Number(data.status),
          sort: data.sort,
          lat: data.lat,
          lng: data.lng,
        });
      }
      if (res.status !== 200) {
        enqueueSnackbar("エラーが発生しました。", { variant: "error" });
        return;
      }
      reset();
      enqueueSnackbar(currentStation ? "更新しました！" : "作成しました！");
      router.push(paths.admin.station.root);
    } catch (error) {
      console.error(error);
    }
  });

  const renderDetails = (
    <>
      <Grid xs={12}>
        <Card>
          <Stack spacing={3} sx={{ p: 3 }}>
            <RHFTextField name="id" label="駅ID" />

            <RHFTextField name="name" label="駅名" />

            <RHFTextField name="permalink" label="パーマリンク" />

            <RHFTextField name="station_group_id" label="駅グループID" />

            <RHFSelect native name="line_id" label="路線">
              <option value=""></option>
              {lines.map((line) => (
                <option key={line.id} value={line.id}>
                  {line.name}
                </option>
              ))}
            </RHFSelect>

            <RHFSelect native name="prefecture_id" label="都道府県">
              <option value=""></option>
              {prefectures.map((prefecture) => (
                <option key={prefecture.id} value={prefecture.id}>
                  {prefecture.name}
                </option>
              ))}
            </RHFSelect>

            <RHFSelect native name="city_id" label="市区町村">
              <option value=""></option>
              {cities.map((city) => (
                <option key={city.id} value={city.id}>
                  {city.name}
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

            <RHFTextField
              name="lat"
              label="緯度"
              placeholder="0"
              type="number"
            />

            <RHFTextField
              name="lng"
              label="経度"
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
          {!currentStation ? "駅を作成" : "駅を変更"}
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
