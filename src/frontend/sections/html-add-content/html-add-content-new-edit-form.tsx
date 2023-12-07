import * as Yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMemo, useEffect, useState } from "react";

import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Grid from "@mui/material/Unstable_Grid2";
import Typography from "@mui/material/Typography";
import LoadingButton from "@mui/lab/LoadingButton";

import { paths } from "@/routes/paths";
import { useRouter } from "@/routes/hooks";

import { useResponsive } from "@/hooks/use-responsive";

import { useSnackbar } from "@/components/snackbar";
import FormProvider, {
  RHFSelect,
  RHFAutocomplete,
  RHFSwitch,
  RHFEditor,
} from "@/components/hook-form";

import { IHtmlAddContentItem } from "@/types/html-add-content";
import { IPrefectureItem } from "@/types/prefecture";
import { IGovernmentCityItem } from "@/types/government-city";
import { ICityItem } from "@/types/city";
import { IStationItem } from "@/types/station";
import axios, { endpoints } from "@/utils/axios";
import { useSearchCities } from "@/api/city";
import { useSearchStations } from "@/api/station";

// ----------------------------------------------------------------------

type Props = {
  currentHtmlAddContent?: IHtmlAddContentItem;
  prefectures: IPrefectureItem[];
  governmentCities: IGovernmentCityItem[];
};

export default function HtmlAddContentNewEditForm({
  currentHtmlAddContent,
  prefectures,
  governmentCities,
}: Props) {
  const router = useRouter();

  const mdUp = useResponsive("up", "md");

  const { enqueueSnackbar } = useSnackbar();

  const NewHtmlAddContentSchema = Yup.object().shape({
    prefecture_id: Yup.string().required("都道府県を入力してください。"),
    government_city_id: Yup.string(),
    city_id: Yup.string(),
    station_id: Yup.string(),
    display_average_salary: Yup.boolean(),
    display_feature: Yup.boolean(),
    feature: Yup.string(),
  });

  const defaultValues = useMemo(
    () => ({
      prefecture_id: currentHtmlAddContent?.prefecture_id || "",
      government_city_id: currentHtmlAddContent?.government_city_id || "",
      city_id: currentHtmlAddContent?.city_id || "",
      station_id: currentHtmlAddContent?.station_id || "",
      display_average_salary:
        currentHtmlAddContent?.display_average_salary == "1"
          ? true
          : false || false,
      display_feature:
        currentHtmlAddContent?.display_feature == "1" ? true : false || false,
      feature: currentHtmlAddContent?.feature || "",
    }),
    [currentHtmlAddContent]
  );

  const methods = useForm({
    resolver: yupResolver(NewHtmlAddContentSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    if (currentHtmlAddContent) {
      reset(defaultValues);
    }
  }, [currentHtmlAddContent, defaultValues, reset]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      let res;
      if (currentHtmlAddContent) {
        res = await axios.patch(
          endpoints.htmlAddContent.update(currentHtmlAddContent.id),
          {
            prefecture_id: Number(data.prefecture_id),
            government_city_id: data.government_city_id
              ? Number(data.government_city_id)
              : "",
            city_id: data.city_id ? Number(data.city_id) : "",
            station_id: data.station_id ? Number(data.station_id) : "",
            display_average_salary: data.display_average_salary ? 1 : 0,
            display_feature: data.display_feature ? 1 : 0,
            feature: data.feature,
          }
        );
      } else {
        res = await axios.post(endpoints.htmlAddContent.create, {
          prefecture_id: Number(data.prefecture_id),
          government_city_id: data.government_city_id
            ? Number(data.government_city_id)
            : "",
          city_id: data.city_id ? Number(data.city_id) : "",
          station_id: data.station_id ? Number(data.station_id) : "",
          display_average_salary: data.display_average_salary ? 1 : 0,
          display_feature: data.display_feature ? 1 : 0,
          feature: data.feature,
        });
      }
      if (res.status !== 200) {
        enqueueSnackbar("エラーが発生しました。", { variant: "error" });
        return;
      }
      reset();
      enqueueSnackbar(
        currentHtmlAddContent ? "更新しました！" : "作成しました！"
      );
      router.push(paths.admin.htmlAddContent.root);
    } catch (error) {
      console.error(error);
    }
  });

  const [selectPrefectureId, setSelectPrefectureId] = useState<string>(
    currentHtmlAddContent?.prefecture_id || ""
  );
  const { cities: searchCities } = useSearchCities(selectPrefectureId);
  const { stations: searchStations } = useSearchStations(selectPrefectureId);
  /*useEffect(() => {
    // 都道府県が変更された場合
    //setSearchKey(`prefecture_id=${prefectureId}`);
    //useSearchCities(`prefecture_id=${prefectureId}`);
  }, [prefectureId, searchCities]);*/

  const renderDetails = (
    <>
      <Grid xs={12}>
        <Card>
          <Stack spacing={3} sx={{ p: 3 }}>
            <RHFSelect
              native
              name="prefecture_id"
              label="都道府県"
              onChange={(event) => {
                // TODO onChangeを設定すると、都道府県が選択状態にならない
                setSelectPrefectureId(event.target.value);
              }}
            >
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

            <RHFAutocomplete
              name="city_id"
              label="市区町村"
              options={searchCities.map((city) => city.name)}
              getOptionLabel={(option) => option}
              renderOption={(props, option) => {
                const { id, name } = searchCities.filter(
                  (city) => city.name === option
                )[0];

                if (!name) {
                  return null;
                }

                return (
                  <li {...props} key={name}>
                    {name}
                  </li>
                );
              }}
            />

            <RHFAutocomplete
              name="station_id"
              label="駅"
              options={searchStations.map((station) => station.name)}
              getOptionLabel={(option) => option}
              renderOption={(props, option) => {
                const { id, name } = searchStations.filter(
                  (station) => station.name === option
                )[0];

                if (!name) {
                  return null;
                }

                return (
                  <li {...props} key={name}>
                    {name}
                  </li>
                );
              }}
            />

            <RHFSwitch
              name="display_average_salary"
              label="平均給与表示フラグ"
              sx={{ m: 0 }}
            />

            <RHFSwitch
              name="display_feature"
              label="特徴表示フラグ"
              sx={{ m: 0 }}
            />

            <Stack spacing={1.5}>
              <Typography variant="subtitle2">特徴</Typography>
              <RHFEditor simple name="feature" />
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
          {!currentHtmlAddContent
            ? "HTML追加コンテンツを作成"
            : "HTML追加コンテンツを変更"}
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
